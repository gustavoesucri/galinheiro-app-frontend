import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, ActivityIndicator, View } from 'react-native'
import { Text, Dialog, Portal } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { ovosSchema } from '../../schemas/ovosSchema'
import { adicionarOvoThunk, atualizarOvoThunk, removerOvoThunk } from '../../redux/thunks/ovosThunk'
import { carregarGalinhas } from '../../redux/thunks/galinhasThunk'
import { carregarNinhos } from '../../redux/thunks/ninhosThunk'
import { validarIdadeParaPostura } from '../../utils/businessRules'
import { useTema } from '../../hooks/useTema'
import Button from '../../components/Button'
import DialogButton from '../../components/DialogButton'
import Input from '../../components/Input'
import DatePickerField from '../../components/DatePickerField'
import TextArea from '../../components/TextArea'
import ChoiceButtonGroup from '../../components/ChoiceButtonGroup'
import { useFocusEffect } from '@react-navigation/native'
import CustomSelectField from '../../components/CustomSelectField'

export default function OvosForm({ navigation, route }) {
  const tema = useTema()
  const { layout, typography, colors } = tema
  const dispatch = useDispatch()
  const galinhas = useSelector(state => state.galinhas.lista)
  const ninhos = useSelector(state => state.ninhos.lista)
  const ovos = useSelector(state => state.ovos.lista)
  const { ovo, galinha: prefillGalinha, origin } = route.params || {}
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(ovosSchema),
    defaultValues: {
      data: new Date(),
      // se vier de GalinhasForm, preenche o ID da galinha; caso contrário, 'desconhecida'
      galinhaId: prefillGalinha?.id || 'desconhecida',
      ninhoId: '',
      tamanho: 'Médio',
      cor: 'Branco',
      qualidade: 'Boa',
      observacoes: '',
    },
  })

  // Recarrega dados sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        setLoading(true)
        await Promise.all([
          dispatch(carregarGalinhas()),
          dispatch(carregarNinhos()),
        ])
        setLoading(false)
      }

      carregarDados()
    }, [dispatch])
  )

  // Preenche valores do form ao editar
  useEffect(() => {
    if (ovo) {
      reset({
        data: ovo.data ? new Date(ovo.data) : new Date(),
        galinhaId: ovo.galinhaId || 'desconhecida',
        ninhoId: ovo.ninhoId || '',
        tamanho: ovo.tamanho || 'Médio',
        cor: ovo.cor || 'Branco',
        qualidade: ovo.qualidade || 'Boa',
        observacoes: ovo.observacoes || '',
      })
    } else if (prefillGalinha?.id) {
      // Se vier com galinha pré-preenchida (vindo de GalinhasForm)
      reset({
        data: new Date(),
        galinhaId: prefillGalinha.id,
        ninhoId: '',
        tamanho: 'Médio',
        cor: 'Branco',
        qualidade: 'Boa',
        observacoes: '',
      })
    }
  }, [ovo, prefillGalinha, reset])

  const onSubmit = (data) => {
    // RN-014: Validar idade mínima para postura (só se tiver galinha conhecida)
    if (data.galinhaId && data.galinhaId !== 'desconhecida') {
      const galinha = galinhas.find(g => String(g.id) === String(data.galinhaId))
      if (galinha && galinha.data_nascimento) {
        const resultadoIdade = validarIdadeParaPostura(galinha.data_nascimento, data.data)
        if (!resultadoIdade.valido) {
          setErrorMsg(resultadoIdade.mensagem)
          return
        }
      }
    }
    
    // Validação: máximo 2 ovos por galinha por dia (só para galinhas conhecidas)
    if (data.galinhaId && data.galinhaId !== 'desconhecida') {
      const eggsToday = ovos.filter(o => {
        // Se estamos editando, não contar o ovo atual
        if (ovo && o.id === ovo.id) return false

        // Checar se é da mesma galinha
        if (o.galinhaId !== data.galinhaId) return false

        // Checar se é do mesmo dia
        const ovoDate = new Date(o.data)
        const dataDate = new Date(data.data)

        return (
          ovoDate.getFullYear() === dataDate.getFullYear() &&
          ovoDate.getMonth() === dataDate.getMonth() &&
          ovoDate.getDate() === dataDate.getDate()
        )
      })

      // Se já tem 2 ovos hoje e não é edição, rejeitar
      if (!ovo && eggsToday.length >= 2) {
        setErrorMsg('Esta galinha já pode colocar no máximo 2 ovos por dia!')
        return
      }
    }

    setErrorMsg(null)

  const novoOvo = ovo ? { ...ovo, ...data } : { ...data }
    if (ovo) dispatch(atualizarOvoThunk(novoOvo))
    else dispatch(adicionarOvoThunk(novoOvo))
    navigation.goBack()
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      setShowDeleteDialog(false)
      await dispatch(removerOvoThunk(ovo.id))
      navigation.goBack()
    } catch (error) {
      console.error('Erro ao deletar ovo:', error)
    }
  }

  if (loading) {
    return (
      <View style={[layout.container, { justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView 
      contentContainerStyle={[layout.formContainer, styles.container]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <Text style={[typography.title, styles.title]}>
        {ovo ? 'Editar Ovo' : 'Cadastrar Ovo'}
      </Text>

      {errorMsg && (
        <View style={[styles.errorContainer, { 
          backgroundColor: colors.alertBackground,
          borderLeftColor: colors.alertBorder,
        }]}>
          <Text style={[styles.errorText, { color: colors.alertText }]}>{errorMsg}</Text>
        </View>
      )}

      <Controller
        control={control}
        name="data"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <DatePickerField
            label="Data da coleta"
            date={value}
            onChange={onChange}
            error={error?.message}
            fullWidth={false}
            disabled={!!ovo}
          />
        )}
      />

      <Controller
        control={control}
        name="galinhaId"
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const opcoesGalinhas = [
            { label: 'Desconhecida', value: 'desconhecida' },
            ...galinhas.map(g => ({
              label: g.nome,
              value: g.id,
            }))
          ]

          // Se vier de GalinhasForm com galinha pré-definida, mostra um campo não editável
          // Ou se estiver editando um ovo que foi criado a partir de GalinhasList
          if (ovo?.galinhaId && ovo.galinhaId !== 'desconhecida' && origin === 'GalinhasListEdit') {
            const galinhaSelecionada = galinhas.find(g => g.id === ovo.galinhaId)
            const nomePrefill = galinhaSelecionada?.nome || 'Galinha'
            return (
              <Input 
                label="Galinha" 
                value={nomePrefill} 
                editable={false} 
              />
            )
          }

          // Se vier de GalinhasForm com galinha pré-definida, mostra um campo não editável
          if (prefillGalinha?.id && origin === 'GalinhasForm') {
            const galinhaSelecionada = galinhas.find(g => g.id === prefillGalinha.id)
            const nomePrefill = galinhaSelecionada?.nome || prefillGalinha.nome
            return (
              <Input 
                label="Galinha" 
                value={nomePrefill} 
                editable={false} 
              />
            )
          }

          return (
            <CustomSelectField
              key={`galinha-custom-${galinhas.length}`}
              label="Galinha"
              value={value}
              onValueChange={onChange}
              options={opcoesGalinhas}
              placeholder="Selecione uma galinha"
              zIndex={3000}
              error={error?.message}
            />
          )
        }}
      />

      <Controller
        control={control}
        name="ninhoId"
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const opcoesNinhos = [
            { label: 'Nenhum', value: '' },
            ...ninhos.map(n => ({
              label: n.identificacao,
              value: n.id,
            })),
          ]

          return (
            <CustomSelectField
              key={`ninho-custom-${ninhos.length}`}
              label="Ninho (opcional)"
              value={value}
              onValueChange={onChange}
              options={opcoesNinhos}
              placeholder="Selecione um ninho"
              zIndex={2000}
              error={error?.message}
            />
          )
        }}
      />

      <Controller
        control={control}
        name="tamanho"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <ChoiceButtonGroup
            label="Tamanho"
            options={[
              { label: 'Pequeno', value: 'Pequeno' },
              { label: 'Médio', value: 'Médio' },
              { label: 'Grande', value: 'Grande' },
              { label: 'Extra', value: 'Extra' },
            ]}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="cor"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <ChoiceButtonGroup
            label="Cor"
            options={[
              { label: 'Branco', value: 'Branco' },
              { label: 'Marrom', value: 'Marrom' },
              { label: 'Azul', value: 'Azul' },
              { label: 'Verde', value: 'Verde' },
            ]}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="qualidade"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <ChoiceButtonGroup
            label="Qualidade"
            options={[
              { label: 'Boa', value: 'Boa' },
              { label: 'Quebrado', value: 'Quebrado' },
              { label: 'Defeituoso', value: 'Defeituoso' },
            ]}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="observacoes"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextArea
            label="Observações"
            value={value}
            onChangeText={onChange}
            error={error?.message}
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)}>
        {ovo ? 'Salvar alterações' : 'Adicionar Ovo'}
      </Button>

      {ovo && (
        <Button 
          onPress={handleDelete}
          style={{ marginTop: 12, backgroundColor: colors.error }}
          textColor={colors.white}
        >
          Deletar Ovo
        </Button>
      )}

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Deletar Ovo</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja remover este ovo?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton variant="cancel" onPress={() => setShowDeleteDialog(false)}>
              Cancelar
            </DialogButton>
            <DialogButton variant="delete" onPress={confirmDelete}>
              Deletar
            </DialogButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { },
  title: { marginBottom: 16 },
  errorContainer: {
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
