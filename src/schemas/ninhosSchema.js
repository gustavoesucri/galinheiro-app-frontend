import * as yup from 'yup'
import { validarDataLimpeza } from '../utils/businessRules'

export const ninhosSchema = yup.object().shape({
  identificacao: yup
    .string()
    .required('Identificação é obrigatória')
    .max(50, 'Máximo de 50 caracteres'),
  tipo_material: yup
    .string()
    .oneOf(['Palha', 'Serragem', 'Plástico'], 'Selecione um tipo válido')
    .required('Tipo de material é obrigatório'),
  galpaoId: yup
    .string()
    .required('Selecione o galpão'),
  ocupado: yup.boolean().test('galinha-requerida', 'Selecione uma galinha quando o ninho estiver ocupado', function(value) {
    if (value === true) {
      return !!this.parent.galinhaId
    }
    return true
  }),
  ultima_limpeza: yup
    .date()
    .required('Data da última limpeza é obrigatória')
    .typeError('Data inválida')
    .test('data-futura', 'Data da última limpeza não pode ser futura', function(value) {
      const resultado = validarDataLimpeza(value)
      return resultado.valido
    }),
  observacoes: yup.string().max(500, 'Máximo de 500 caracteres').nullable(),
  galinhaId: yup.string().nullable(),
})
