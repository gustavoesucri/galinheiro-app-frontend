import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTema } from '../../hooks/useTema'
import Button from '../../components/Button'
import NumberSpinner from '../../components/NumberSpinner'
import SwitchField from '../../components/SwitchField'
import CheckboxField from '../../components/CheckboxField'
import { adicionarMedicaoThunk, atualizarMedicaoThunk } from '../../redux/thunks/medicaoAmbienteThunk'
import { carregarGalpoes } from '../../redux/thunks/galpoesThunk'
import { medicaoAmbienteSchema } from '../../schemas/medicaoAmbienteSchema'
import CustomSelectField from '../../components/CustomSelectField'
import DateTimePickerField from '../../components/DateTimePickerField'
import CustomSliderField from '../../components/CustomSliderField'

export default function MedicaoAmbienteForm({ navigation, route }) {
  const tema = useTema()
  const { layout, typography, colors } = tema
  const dispatch = useDispatch()
  const { medicao } = route.params || {}
  const galpoes = useSelector((state) => state.galpoes.lista)

  useEffect(() => {
    dispatch(carregarGalpoes())
  }, [dispatch])

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(medicaoAmbienteSchema),
    defaultValues: {
      data_medicao: new Date(),
      temperatura: 25.0,
      umidade: 50.0,
      luminosidade: 300,
      ventilacao_ativa: false,
      usa_ventilacao: false,
      galpaoId: '',
    },
  })

  // Watch usa_ventilacao para desabilitar ventilacao_ativa
  const usaVentilacao = useWatch({
    control,
    name: 'usa_ventilacao',
  })

  // Se usa_ventilacao for false, desabilita ventilacao_ativa
  useEffect(() => {
    if (!usaVentilacao) {
      setValue('ventilacao_ativa', false)
    }
  }, [usaVentilacao, setValue])

  useEffect(() => {
    if (medicao) {
      reset({
        data_medicao: medicao.data_medicao ? new Date(medicao.data_medicao) : new Date(),
        temperatura: medicao.temperatura !== undefined ? medicao.temperatura : 25.0,
        umidade: medicao.umidade !== undefined ? medicao.umidade : 50.0,
        luminosidade: medicao.luminosidade !== undefined ? medicao.luminosidade : 300,
        ventilacao_ativa: medicao.ventilacao_ativa || false,
        usa_ventilacao: medicao.usa_ventilacao || false,
        galpaoId: medicao.galpaoId || '',
      })
    }
  }, [medicao, reset])


  const onSubmit = (data) => {
    const novaMedicao = medicao ? { ...medicao, ...data } : data
    if (medicao) dispatch(atualizarMedicaoThunk(novaMedicao))
    else dispatch(adicionarMedicaoThunk(novaMedicao))
    navigation.goBack()
  }

  // Se não há galpões cadastrados, mostrar aviso
  if (galpoes.length === 0) {
    return (
      <View style={[layout.container, { justifyContent: 'center', padding: 20 }]}>
        <Text style={[typography.title, { textAlign: 'center', marginBottom: 16 }]}>
          Nenhum galpão cadastrado 🏚️
        </Text>
        <Text style={[typography.body, { textAlign: 'center', marginBottom: 24, color: colors.textSecondary }]}>
          Você precisa cadastrar pelo menos um galpão antes de registrar medições ambientais.
        </Text>
        <Button onPress={() => navigation.navigate('GalpoesForm')}>
          Cadastrar Galpão
        </Button>
        <Button 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 12, backgroundColor: 'transparent' }}
        >
          <Text style={{ color: colors.accent }}>Voltar</Text>
        </Button>
      </View>
    )
  }

  return (
    <ScrollView 
      contentContainerStyle={[layout.formContainer, styles.container]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Text style={[typography.title, styles.title]}>
        {medicao ? 'Editar Medição' : 'Nova Medição'}
      </Text>

      <Controller
  control={control}
  name="data_medicao"
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <DateTimePickerField
      label="Data e Hora da Medição"
      date={value}
      onChange={onChange}
      error={error?.message}
      fullWidth={false}
    />
  )}
/>

      <Controller
        control={control}
        name="temperatura"
        render={({ field: { onChange, value } }) => (
          <NumberSpinner
            label="Temperatura (°C)"
            value={value}
            onChange={onChange}
            min={-10}
            max={50}
            step={0.1}
          />
        )}
      />

      <Controller
        control={control}
        name="umidade"
        render={({ field: { onChange, value } }) => (
          <NumberSpinner
            label="Umidade (%)"
            value={value}
            onChange={onChange}
            min={0}
            max={100}
            step={0.1}
          />
        )}
      />

      <Controller
  control={control}
  name="luminosidade"
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <CustomSliderField
      label="Luminosidade"
      value={value ?? 0}
      onValueChange={onChange}
      error={error?.message}
    />
  )}
/>


      <View style={styles.ventilacaoRow}>
        <Controller
          control={control}
          name="ventilacao_ativa"
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <SwitchField
                label="Ventilação Ativa?"
                value={value}
                onValueChange={onChange}
                
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="usa_ventilacao"
          render={({ field: { onChange, value } }) => (
            <CheckboxField
              label="Usa ventilação?"
              value={value}
              onValueChange={onChange}
              style={styles.checkbox}
            />
          )}
        />
      </View>

      <Controller
  control={control}
  name="galpaoId"
  render={({ field: { onChange, value }, fieldState: { error } }) => (
    <CustomSelectField
      label="Galpão"
      value={value}
      onValueChange={onChange}
      options={galpoes.map((g) => ({
        label: g.nome,
        value: g.id
      }))}
      error={error?.message}
    />
  )}
/>

      <Button onPress={handleSubmit(onSubmit)}>
        {medicao ? 'Salvar Alterações' : 'Salvar'}
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { },
  title: { marginBottom: 16 },
  ventilacaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchContainer: {
    flex: 1,
  },
  switch: {
    marginBottom: 0,
  },
  switchDisabled: {
    opacity: 0.3,
  },
  checkbox: {
    marginLeft: 8,
  },
})
