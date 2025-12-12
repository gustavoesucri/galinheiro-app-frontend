import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text, Checkbox } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useTema } from '../../hooks/useTema'
import Button from '../../components/Button'
import NumberSpinner from '../../components/NumberSpinner'
import NumberInput from '../../components/NumberInput'
import { alertasSchema } from '../../schemas/alertasSchema'
import { salvarConfiguracoes } from '../../redux/thunks/alertasThunk'
import { setConfiguracoes } from '../../redux/slices/alertasSlice'

export default function AlertasScreen({ navigation }) {
  const tema = useTema()
  const { layout, typography, colors } = tema
  const dispatch = useDispatch()
  const configuracoes = useSelector((state) => state.alertas)

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(alertasSchema),
    defaultValues: configuracoes,
  })

  useEffect(() => {
    reset(configuracoes)
  }, [configuracoes, reset])

  const onSubmit = (data) => {
    dispatch(setConfiguracoes(data))
    dispatch(salvarConfiguracoes())
    navigation.goBack()
  }

  return (
    <ScrollView contentContainerStyle={[layout.formContainer, styles.container]}>
      <Text style={[typography.title, styles.title]}>⚙️ Configurações de Alertas</Text>

      {/* Galpões Inativos */}
      <View style={[styles.fieldRow, styles.ventilacaoRow]}>
        <View style={styles.fieldContent}>
          <Text style={[typography.label, { color: colors.textPrimary, fontWeight: '600' }]}>
            Mostrar alertas de galpões inativos
          </Text>
          <Text style={[typography.small, { color: colors.textSecondary, marginTop: 4 }]}>
            Inclui medições, limpeza de ninhos e outras notificações
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaGalpoesInativos"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Temperatura Alta */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="temperaturaAlta"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberSpinner
                label="Temperatura Alta (°C)"
                value={value}
                onChange={onChange}
                min={0}
                max={60}
                step={0.5}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaTemperaturaAlta"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Temperatura Baixa */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="temperaturaBaixa"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberSpinner
                label="Temperatura Baixa (°C)"
                value={value}
                onChange={onChange}
                min={-20}
                max={50}
                step={0.5}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaTemperaturaBaixa"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Umidade Alta */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="umidadeAlta"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberSpinner
                label="Umidade Alta (%)"
                value={value}
                onChange={onChange}
                min={0}
                max={100}
                step={1}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaUmidadeAlta"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Umidade Baixa */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="umidadeBaixa"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberSpinner
                label="Umidade Baixa (%)"
                value={value}
                onChange={onChange}
                min={0}
                max={100}
                step={1}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaUmidadeBaixa"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Ventilação Desativada */}
      <View style={[styles.fieldRow, styles.ventilacaoRow]}>
        <View style={styles.fieldContent}>
          <Text style={[typography.label, { color: colors.textPrimary }]}>
            Alertar sobre ventilação desativada
          </Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaVentilacaoDesativada"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Dias sem Limpeza */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="diasSemLimpeza"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberInput
                label="Dias sem limpeza (ninhos)"
                value={value}
                onChange={onChange}
                min={1}
                max={90}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaDiasSemLimpeza"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Percentual de Galinhas Adoecidas */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="percentualGalinhasAdoecidas"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberSpinner
                label="Percentual de galinhas adoecidas (%)"
                value={value}
                onChange={onChange}
                min={0}
                max={100}
                step={1}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaGalinhasAdoecidas"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      {/* Idade Máxima das Galinhas */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldContent}>
          <Controller
            control={control}
            name="idadeMaximaGalinhas"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <NumberInput
                label="Idade máxima das galinhas (dias)"
                value={value}
                onChange={onChange}
                min={1}
                max={8030}
              />
            )}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Controller
            control={control}
            name="alertaIdadeMaximaGalinhas"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
                color={colors.primary}
              />
            )}
          />
        </View>
      </View>

      <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
        Salvar Configurações
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { },
  title: { marginBottom: 24 },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  ventilacaoRow: {
    marginVertical: 8,
    paddingVertical: 12,
  },
  fieldContent: {
    flex: 1,
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  button: {
    marginTop: 24,
  },
})
