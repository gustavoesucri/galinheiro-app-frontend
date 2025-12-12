import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Text, ActivityIndicator } from 'react-native-paper'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTema } from '../../hooks/useTema'
import Button from '../../components/Button'
import Input from '../../components/Input'
import SwitchField from '../../components/SwitchField'
import DatePickerField from '../../components/DatePickerField'
import TextArea from '../../components/TextArea'
import CustomSelectField from '../../components/CustomSelectField'
import { yupResolver } from '@hookform/resolvers/yup'
import { ninhosSchema } from '../../schemas/ninhosSchema'
import { useDispatch, useSelector } from 'react-redux'
import { adicionarNinhoThunk, atualizarNinhoThunk } from '../../redux/thunks/ninhosThunk'
import { carregarGalinhas } from '../../redux/thunks/galinhasThunk'
import { carregarGalpoes } from '../../redux/thunks/galpoesThunk'
import { autoCorrigirNinhoDesocupado, validarIdentificacaoNinhoUnica } from '../../utils/businessRules'

export default function NinhosForm({ navigation, route }) {
  const tema = useTema()
  const { layout, typography, colors } = tema
  const dispatch = useDispatch()
  const galinhas = useSelector(state => state.galinhas.lista)
  const galpoes = useSelector((state) => state.galpoes.lista)
  const ninhos = useSelector((state) => state.ninhos.lista)
  const [loadingGalinhas, setLoadingGalinhas] = useState(true)
  const [identificacaoErro, setIdentificacaoErro] = useState(null)
  const { ninho } = route.params || {}

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(ninhosSchema),
    defaultValues: {
      identificacao: '',
      tipo_material: 'Palha',
      ocupado: false,
      ultima_limpeza: new Date(),
      observacoes: '',
      galpaoId: '',
      galinhaId: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(carregarGalinhas()),
        dispatch(carregarGalpoes())
      ])
      setLoadingGalinhas(false)
    }
    fetchData()
  }, [dispatch])

  useEffect(() => {
    if (ninho) {
      reset({
        identificacao: ninho.identificacao || '',
        tipo_material: ninho.tipo_material || 'Palha',
        galpaoId: ninho.galpaoId || '',
        ocupado: ninho.ocupado || false,
        ultima_limpeza: ninho.ultima_limpeza ? new Date(ninho.ultima_limpeza) : new Date(),
        observacoes: ninho.observacoes || '',
        galinhaId: ninho.galinhaId || '',
      })
    } else {
      reset({
        identificacao: '',
        tipo_material: 'Palha',
        ocupado: false,
        ultima_limpeza: new Date(),
        observacoes: '',
        galpaoId: '',
        galinhaId: '',
      })
    }
  }, [ninho, galinhas, reset])

  // RN-029: Auto-corrigir ninho desocupado
  const ocupado = useWatch({ control, name: 'ocupado' })
  const galinhaId = useWatch({ control, name: 'galinhaId' })
  const identificacao = useWatch({ control, name: 'identificacao' })
  const galpaoId = useWatch({ control, name: 'galpaoId' })

  useEffect(() => {
    const resultado = autoCorrigirNinhoDesocupado(ocupado, galinhaId)
    if (resultado.corrigir) {
      setValue('galinhaId', null)
    }
  }, [ocupado, galinhaId, setValue])

  // RN-034: Validar unicidade da identificação por galpão
  useEffect(() => {
    if (identificacao && identificacao.trim() && galpaoId) {
      const resultado = validarIdentificacaoNinhoUnica(identificacao, galpaoId, ninhos, ninho?.id)
      if (!resultado.valido) {
        setIdentificacaoErro(resultado.mensagem)
      } else {
        setIdentificacaoErro(null)
      }
    }
  }, [identificacao, galpaoId, ninhos, ninho])

  const onSubmit = (data) => {
    // Validação final
    if (identificacaoErro) {
      alert(identificacaoErro)
      return
    }

    // RN-029: Garantir que ninho desocupado não tenha galinhaId
    if (!data.ocupado) {
      data.galinhaId = null
    }

    if (ninho) {
      dispatch(atualizarNinhoThunk({ ...ninho, ...data }))
    } else {
      dispatch(adicionarNinhoThunk(data))
    }
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
          Você precisa cadastrar pelo menos um galpão antes de cadastrar ninhos.
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
        {ninho ? 'Editar Ninho' : 'Cadastrar / Atualizar Ninho'}
      </Text>

      <Controller
        control={control}
        name="identificacao"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label="Identificação"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="tipo_material"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomSelectField
            label="Tipo de Material"
            value={value}
            onValueChange={onChange}
            options={[
              { label: 'Palha', value: 'Palha' },
              { label: 'Serragem', value: 'Serragem' },
              { label: 'Plástico', value: 'Plástico' },
            ]}
            placeholder="Selecione o material"
            error={error?.message}
            zIndex={3000}
          />
        )}
      />

      <Controller
        control={control}
        name="galpaoId"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <CustomSelectField
            label="Galpão"
            value={value}
            onValueChange={onChange}
            options={galpoes.map((g) => ({ label: g.nome, value: g.id }))}
            placeholder="Selecione o galpão"
            error={error?.message}
            zIndex={2500}
          />
        )}
      />

      <Controller
        control={control}
        name="ocupado"
        render={({ field: { onChange, value } }) => (
          <SwitchField label="Ocupado?" value={value} onValueChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="ultima_limpeza"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <DatePickerField
            label="Última Limpeza"
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

      <View style={{ marginVertical: 8 }}>
        {loadingGalinhas ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
            }}
          >
            <ActivityIndicator animating size="small" color={colors.accent} />
            <Text style={{ marginLeft: 8 }}>Carregando galinhas...</Text>
          </View>
        ) : (
          <>
            <Controller
              control={control}
              name="galinhaId"
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                const opcoesGalinhas = [
                  { label: 'Nenhuma', value: '' },
                  ...galinhas.map(g => ({
                    label: g.nome,
                    value: g.id,
                  })),
                ]

                return (
                  <CustomSelectField
                    key={`galinha-custom-${galinhas.length}`}
                    label="Galinha (opcional)"
                    value={value}
                    onValueChange={onChange}
                    options={opcoesGalinhas}
                    placeholder="Selecione uma galinha"
                    error={error?.message}
                    zIndex={2000}
                  />
                )
              }}
            />
          </>
        )}
      </View>

      <Button onPress={handleSubmit(onSubmit)}>
        {ninho ? 'Salvar alterações' : 'Salvar'}
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { },
  title: { marginBottom: 16 },
})
