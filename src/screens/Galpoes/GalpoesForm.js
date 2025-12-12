import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { galpoesSchema } from '../../schemas/galpoesSchema'
import { adicionarGalpaoThunk, atualizarGalpaoThunk } from '../../redux/thunks/galpoesThunk'
import { validarDensidadeGalpao, validarNomeGalpaoUnico } from '../../utils/businessRules'
import { useTema } from '../../hooks/useTema'
import Button from '../../components/Button'
import Input from '../../components/Input'
import DatePickerField from '../../components/DatePickerField'
import TextArea from '../../components/TextArea'
import ChoiceButtonGroup from '../../components/ChoiceButtonGroup'
import SegmentedControl from '../../components/SegmentedControl'
import NumberInput from '../../components/NumberInput'
import InputFloat from '../../components/InputFloat'
import SwitchField from '../../components/SwitchField'

export default function GalpoesForm({ navigation, route }) {
  const tema = useTema()
  const { layout, typography, colors } = tema
  const dispatch = useDispatch()
  const { galpao } = route.params || {}
  const galpoes = useSelector(state => state.galpoes.lista)
  const [densidadeAviso, setDensidadeAviso] = useState(null)
  const [nomeErro, setNomeErro] = useState(null)

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(galpoesSchema),
    defaultValues: {
      nome: '',
      capacidade_maxima_galinhas: 10,
      capacidade_maxima_ninhos: 10,
      numero_ninhos_ocupados: 0,
      area_m2: '',
      tipo_piso: 'terra',
      ventilacao: 'natural',
      ativo: true,
      data_ultima_manutencao: new Date(),
      observacoes: '',
    },
  })

  // Watch para calcular densidade em tempo real
  const areaM2 = useWatch({ control, name: 'area_m2' })
  const capacidadeGalinhas = useWatch({ control, name: 'capacidade_maxima_galinhas' })
  const nome = useWatch({ control, name: 'nome' })

  // Validar densidade
  useEffect(() => {
    if (areaM2 && capacidadeGalinhas) {
      const resultado = validarDensidadeGalpao(areaM2, capacidadeGalinhas)
      if (resultado.aviso) {
        setDensidadeAviso(resultado.mensagem)
      } else {
        setDensidadeAviso(null)
      }
    }
  }, [areaM2, capacidadeGalinhas])

  // Validar unicidade do nome
  useEffect(() => {
    if (nome && nome.trim()) {
      const resultado = validarNomeGalpaoUnico(nome, galpoes, galpao?.id)
      if (!resultado.valido) {
        setNomeErro(resultado.mensagem)
      } else {
        setNomeErro(null)
      }
    }
  }, [nome, galpoes, galpao])

  useEffect(() => {
    if (galpao) {
      reset({
        nome: galpao.nome || '',
        capacidade_maxima_galinhas: galpao.capacidade_maxima_galinhas || 10,
        capacidade_maxima_ninhos: galpao.capacidade_maxima_ninhos || 10,
        numero_ninhos_ocupados: galpao.numero_ninhos_ocupados || 0,
        area_m2: galpao.area_m2 || '',
        tipo_piso: galpao.tipo_piso || 'terra',
        ventilacao: galpao.ventilacao || 'natural',
        ativo: galpao.ativo !== undefined ? galpao.ativo : true,
        data_ultima_manutencao: galpao.data_ultima_manutencao ? new Date(galpao.data_ultima_manutencao) : new Date(),
        observacoes: galpao.observacoes || '',
      })
    }
  }, [galpao, reset])

  const onSubmit = async (data) => {
    // Validação final de nome único
    if (nomeErro) {
      Alert.alert('Erro de Validação', nomeErro)
      return
    }
    
    try {
      if (galpao) {
        await dispatch(atualizarGalpaoThunk({ ...galpao, ...data }))
      } else {
        await dispatch(adicionarGalpaoThunk(data))
      }
      navigation.goBack()
    } catch (error) {
      const mensagem = error.response?.data?.message || error.message || 'Erro ao salvar galpão'
      Alert.alert('Erro', mensagem)
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={[layout.formContainer, styles.container]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Text style={[typography.title, styles.title]}>
        {galpao ? 'Editar Galpão' : 'Cadastrar Galpão'}
      </Text>

      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            <Input label="Nome" value={value} onChangeText={onChange} error={error?.message || nomeErro} />
          </View>
        )}
      />

      <Controller
        control={control}
        name="capacidade_maxima_galinhas"
        render={({ field: { onChange, value } }) => (
          <NumberInput
            label="Capacidade máxima de galinhas"
            value={value || 0}
            onChange={onChange}
            min={0}
            max={1000}
          />
        )}
      />

      <Controller
        control={control}
        name="capacidade_maxima_ninhos"
        render={({ field: { onChange, value } }) => (
          <NumberInput
            label="Capacidade máxima de ninhos"
            value={value || 0}
            onChange={onChange}
            min={0}
            max={1000}
          />
        )}
      />

      <Controller
        control={control}
        name="numero_ninhos_ocupados"
        render={({ field: { onChange, value } }) => (
          <NumberInput
            label="Ninhos ocupados"
            value={value || 0}
            onChange={onChange}
            min={0}
            max={1000}
          />
        )}
      />

      <Controller
        control={control}
        name="area_m2"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View>
            <InputFloat
              label="Área (m²)"
              value={value}
              onChange={onChange}
              error={error?.message}
            />
            {densidadeAviso && (
              <Text style={[typography.small, { color: colors.warning || '#f57c00', marginTop: 4 }]}>
                ⚠️ {densidadeAviso}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="tipo_piso"
        render={({ field: { onChange, value } }) => (
          <ChoiceButtonGroup
            label="Tipo de Piso"
            value={value}
            onChange={onChange}
            options={[
              { label: 'Terra', value: 'terra' },
              { label: 'Concreto', value: 'concreto' },
              { label: 'Serragem', value: 'serragem' },
            ]}
          />
        )}
      />

      <Controller
        control={control}
        name="ventilacao"
        render={({ field: { value, onChange } }) => (
          <SegmentedControl
            label="Ventilação"
            value={value}
            onChange={onChange}
            options={[
              { label: 'Natural', value: 'natural' },
              { label: 'Forçada', value: 'forçada' },
              { label: 'Exaustão', value: 'exaustão' },
            ]}
          />
        )}
      />

      <Controller
        control={control}
        name="ativo"
        render={({ field: { onChange, value } }) => (
          <SwitchField label="Ativo" value={value} onValueChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="data_ultima_manutencao"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePickerField
            label="Data da última manutenção"
            date={value}
            onChange={onChange}
            error={error?.message}
            fullWidth={false}
          />
        )}
      />

      <Controller
        control={control}
        name="observacoes"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextArea
            label="Observações"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)}>
        {galpao ? 'Salvar alterações' : 'Adicionar Galpão'}
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { },
  title: { marginBottom: 16 },
})
