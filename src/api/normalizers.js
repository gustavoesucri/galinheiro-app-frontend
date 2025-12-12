const optionalStringFields = {
  galinhas: ['raca', 'galpaoId', 'ninhoId'],
  galpoes: ['observacoes'],
  ninhos: ['galinhaId', 'observacoes'],
  ovos: ['galinhaId', 'ninhoId', 'observacoes'],
  medicoesAmbiente: [],
}

const customToApi = {
  ovos: (record) => ({
    ...record,
    galinhaId:
      record?.galinhaId === 'desconhecida' || record?.galinhaId === ''
        ? null
        : record?.galinhaId,
  }),
  medicoesAmbiente: (record) => ({
    ...record,
    temperatura: record?.temperatura ? parseFloat(record.temperatura) : null,
    umidade: record?.umidade ? parseFloat(record.umidade) : null,
  }),
}

const customFromApi = {
  ovos: (record) => ({
    ...record,
    galinhaId:
      record?.galinhaId === null || record?.galinhaId === undefined
        ? 'desconhecida'
        : record?.galinhaId,
  }),
  medicoesAmbiente: (record) => ({
    ...record,
    temperatura: record?.temperatura ? parseFloat(record.temperatura) : null,
    umidade: record?.umidade ? parseFloat(record.umidade) : null,
  }),
}

const normalizeString = (value) => {
  if (typeof value !== 'string') return value
  return value.trim()
}

const toNullIfEmpty = (value) => {
  if (value === undefined || value === null) {
    return value
  }
  if (typeof value !== 'string') {
    return value
  }
  const normalized = normalizeString(value)
  return normalized === '' ? null : normalized
}

const toEmptyIfNull = (value) => (value === null || value === undefined ? '' : value)

const transformObject = (entityName, record, transformer) => {
  if (!record) return record
  const fields = optionalStringFields[entityName] ?? []
  if (fields.length === 0) {
    return { ...record }
  }

  return fields.reduce((acc, field) => {
    if (field in acc) {
      acc[field] = transformer(acc[field])
    }
    return acc
  }, { ...record })
}

export const toApiPayload = (entityName, payload) => {
  const sanitized = transformObject(entityName, payload, toNullIfEmpty)
  const custom = customToApi[entityName]
  return custom ? custom(sanitized) : sanitized
}

export const fromApiPayload = (entityName, payload) => {
  const normalized = transformObject(entityName, payload, toEmptyIfNull)
  const custom = customFromApi[entityName]
  return custom ? custom(normalized) : normalized
}

export const normalizeApiList = (entityName, list = []) =>
  list.map((item) => fromApiPayload(entityName, item))
