import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTema } from '../../hooks/useTema'

import Button from '../../components/Button'
import Input from '../../components/Input'
import SwitchField from '../../components/SwitchField'
import ChoiceButtonGroup from '../../components/ChoiceButtonGroup'
import AddEggButton from '../../components/AddEggButton'
import DatePickerField from '../../components/DatePickerField'
import CustomSelectField from '../../components/CustomSelectField'

import { galinhaSchema } from '../../schemas/galinhaSchema'
import { useDispatch, useSelector } from 'react-redux'
import { adicionarGalinhaThunk, atualizarGalinhaThunk } from '../../redux/thunks/galinhasThunk'
import { carregarGalpoes } from '../../redux/thunks/galpoesThunk'
import { carregarNinhos } from '../../redux/thunks/ninhosThunk'
import { validarQuarentena, sugerirQuarentenaParaAdoecida } from '../../utils/businessRules'
import RadioButtonGroup from '../../components/RadioButtonGroup'
import { useEffect, useState } from 'react'

export default function GalinhasForm({ route, navigation }) {
  const tema = useTema()
  const { layout, typography, colors } = tema
  const galinha = route?.params?.galinha
  const dispatch = useDispatch()
  
  const galpoes = useSelector(state => state.galpoes.lista)
  const ninhos = useSelector(state => state.ninhos.lista)
  const [sugestaoQuarentena, setSugestaoQuarentena] = useState(null)

  const { control, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(galinhaSchema),
    defaultValues: {
      nome: '',
      saude: '',
      raca: '',
      emQuarentena: false,
      local: 'galpao',
      galpaoId: '',
      ninhoId: '',
      data_nascimento: new Date(),
    },
  })

  // Carrega galpões e ninhos ao montar
  useEffect(() => {
    dispatch(carregarGalpoes())
    dispatch(carregarNinhos())
  }, [dispatch])

  // Preenche valores do form ao editar
  useEffect(() => {
    if (galinha) {
      reset({
        nome: galinha.nome || '',
        saude: galinha.saude || '',
        raca: galinha.raca || '',
        emQuarentena: galinha.emQuarentena || false,
        local: galinha.local || 'galpao',
        galpaoId: galinha.galpaoId || '',
        ninhoId: galinha.ninhoId || '',
        data_nascimento: galinha.data_nascimento ? new Date(galinha.data_nascimento) : new Date(),
      })
    }
  }, [galinha, reset])

  // Observa mudanças no campo 'local', 'emQuarentena' e 'saude'
  const localSelecionado = useWatch({ control, name: 'local' })
  const galpaoSelecionado = useWatch({ control, name: 'galpaoId' })
  const emQuarentena = useWatch({ control, name: 'emQuarentena' })
  const saude = useWatch({ control, name: 'saude' })

  // RN-016: Limpa galpaoId e ninhoId quando em quarentena
  useEffect(() => {
    if (emQuarentena) {
      setValue('local', 'quarentena')
      setValue('galpaoId', '')
      setValue('ninhoId', '')
    }
  }, [emQuarentena, setValue])

  // Limpa galpaoId e ninhoId quando mudar para campo/quarentena
  useEffect(() => {
    if (localSelecionado !== 'galpao') {
      setValue('galpaoId', '')
      setValue('ninhoId', '')
    }
  }, [localSelecionado, setValue])

  // Limpa ninhoId quando mudar o galpão
  useEffect(() => {
    setValue('ninhoId', '')
  }, [galpaoSelecionado, setValue])

  // RN-017: Sugerir quarentena para galinhas adoecidas
  useEffect(() => {
    const resultado = sugerirQuarentenaParaAdoecida(saude, emQuarentena)
    if (resultado.sugestao) {
      setSugestaoQuarentena(resultado.mensagem)
    } else {
      setSugestaoQuarentena(null)
    }
  }, [saude, emQuarentena])

  const onSubmit = (data) => {
    // RN-016: Validar quarentena
    const resultadoQuarentena = validarQuarentena(data.emQuarentena, data.local, data.galpaoId, data.ninhoId)
    if (!resultadoQuarentena.valido) {
      Alert.alert('Erro de Validação', resultadoQuarentena.mensagem)
      return
    }

    if (galinha?.id) {
      dispatch(atualizarGalinhaThunk({ ...data, id: galinha.id }))
    } else {
      dispatch(adicionarGalinhaThunk(data))
    }
    navigation.goBack()
  }

  return (
    <ScrollView 
      contentContainerStyle={[layout.formContainer, styles.container]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Text style={[typography.title, styles.title]}>
        {galinha ? 'Editar Galinha' : 'Cadastrar Galinha'}
      </Text>

      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input label="Nome da Galinha" value={value} onChangeText={onChange} error={error?.message} />
        )}
      />

      <Controller
        control={control}
        name="saude"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <ChoiceButtonGroup
            label="Estado de Saúde"
            options={[
              { label: 'Boa', value: 'Boa' },
              { label: 'Fragilizada', value: 'Fragilizada' },
              { label: 'Adoecida', value: 'Adoecida' },
            ]}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      {/* Campo raça (opcional) */}
      <Controller
        control={control}
        name="raca"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input label="Raça" value={value} onChangeText={onChange} error={error?.message} />
        )}
      />

      {/* Data de nascimento */}
      <Controller
        control={control}
        name="data_nascimento"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePickerField
            label="Data de Nascimento"
            date={value ? new Date(value) : new Date()}
            onChange={onChange}
            error={error?.message}
            fullWidth={false}
          />
        )}
      />

      {/* Botão para adicionar ovo: abre OvosForm com a galinha pré-preenchida (imutável lá) */}
      {/* Este botão só aparece/funciona se a galinha foi salva (tem id) */}
      {galinha?.id && (
        <AddEggButton
          onPress={() => {
            navigation.navigate('OvosForm', { 
              galinha: galinha,
              origin: 'GalinhasForm' 
            })
          }}
        />
      )}

      <Controller
        control={control}
        name="emQuarentena"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SwitchField label="Está em quarentena?" value={value} onValueChange={onChange} error={error?.message} />
        )}
      />

      <Controller
  control={control}
  name="local"
  render={({ field: { value, onChange }, fieldState: { error } }) => (
    <RadioButtonGroup
      label="Tipo de ambiente"
      value={value}
      onChange={onChange}
      options={[
        { label: 'Galpão', value: 'galpao' },
        { label: 'Campo', value: 'campo' },
        { label: 'Quarentena', value: 'quarentena' },
      ]}
    />
  )}
/>

      {/* Campos condicionais quando local = 'galpao' */}
      {localSelecionado === 'galpao' && (
        <>
          <Controller
            control={control}
            name="galpaoId"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CustomSelectField
                label="Galpão"
                value={value}
                onValueChange={onChange}
                options={[
                  { label: 'Selecione um galpão', value: '' },
                  ...galpoes.map(g => ({
                    label: g.nome,
                    value: g.id,
                  })),
                ]}
                placeholder="Selecione um galpão"
                zIndex={3000}
                error={error?.message}
              />
            )}
          />

          {galpaoSelecionado && (
            <Controller
              control={control}
              name="ninhoId"
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                // Filtrar ninhos do galpão selecionado
                const ninhosDoGalpao = ninhos.filter(n => 
                  n.galpaoId === galpaoSelecionado
                )

                return (
                  <CustomSelectField
                    label="Ninho (opcional)"
                    value={value}
                    onValueChange={onChange}
                    options={[
                      { label: 'Nenhum', value: '' },
                      ...ninhosDoGalpao.map(n => ({
                        label: n.identificacao,
                        value: n.id,
                      })),
                    ]}
                    placeholder="Selecione um ninho"
                    zIndex={2000}
                    error={error?.message}
                  />
                )
              }}
            />
          )}
        </>
      )}

      <Button onPress={handleSubmit(onSubmit)}>
        {galinha ? 'Salvar Alterações' : 'Salvar'}
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { },
  title: { marginBottom: 16 },
})
