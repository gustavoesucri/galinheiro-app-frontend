import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import { Card, Text, IconButton } from 'react-native-paper'
import ButtonPaper from '../../components/ButtonPaper'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { carregarGalinhas, removerGalinhaThunk } from '../../redux/thunks/galinhasThunk'
import { carregarGalpoes } from '../../redux/thunks/galpoesThunk'
import { carregarNinhos } from '../../redux/thunks/ninhosThunk'
import { EggIcon, EmptyEggSlot } from '../../components/EggIcons'
import { useTema } from '../../hooks/useTema'
import CustomSelectField from '../../components/CustomSelectField'
import NumberInput from '../../components/NumberInput'

const locais = [
  { label: 'Galpão', value: 'galpao' },
  { label: 'Campo', value: 'campo' },
  { label: 'Quarentena', value: 'quarentena' },
]

export default function GalinhasList() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const galinhas = useSelector(state => state.galinhas.lista)
  const galinhasStatus = useSelector(state => state.galinhas.status)
  const galinhasError = useSelector(state => state.galinhas.error)
  const ovos = useSelector(state => state.ovos.lista)
  const galpoes = useSelector(state => state.galpoes.lista)
  const ninhos = useSelector(state => state.ninhos.lista)
  const botoesClaros = useSelector(state => state.botaoModo.botoesClaros)
  const tema = useTema()
  const { layout, typography, colors } = tema
  
  // Estados de filtro
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroSaude, setFiltroSaude] = useState('')
  const [filtroRaca, setFiltroRaca] = useState('')
  const [filtroQuarentena, setFiltroQuarentena] = useState('')
  const [filtroLocal, setFiltroLocal] = useState('')
  const [filtroIdadeMin, setFiltroIdadeMin] = useState(0)
  const [filtroIdadeMax, setFiltroIdadeMax] = useState(365)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  
  // Filtros aplicados (só mudam ao clicar em "Aplicar Filtros")
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    nome: '',
    saude: '',
    raca: '',
    quarentena: '',
    local: '',
    idadeMin: null,  // null = filtro não aplicado
    idadeMax: null,  // null = filtro não aplicado
  })
  
  // Cor para botão Deletar - laranja fixo ou cor do tema
  const deleteColor = botoesClaros ? tema.colors.primaryOrange : tema.colors.primary
  // Texto: preto no laranja fixo, branco/preto conforme o tema nos outros
  const deleteTextColor = botoesClaros ? tema.colors.black : tema.colors.textOnPrimary

  useEffect(() => {
    dispatch(carregarGalinhas())
    dispatch(carregarGalpoes())
    dispatch(carregarNinhos())
  }, [dispatch])

  // Função para calcular idade em dias
  const calcularIdadeEmDias = (dataNascimento) => {
    if (!dataNascimento) return null
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    const diffTime = Math.abs(hoje - nascimento)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Função para buscar nome do galpão
  const getNomeGalpao = (galpaoId) => {
    if (!galpaoId) return null
    const galpao = galpoes.find(g => String(g.id) === String(galpaoId))
    return galpao ? galpao.nome : null
  }

  // Função para buscar identificação do ninho
  const getNomeNinho = (ninhoId) => {
    if (!ninhoId) return null
    const ninho = ninhos.find(n => String(n.id) === String(ninhoId))
    return ninho ? ninho.identificacao : null
  }

  // Aplicar filtros
  const galinhasFiltradas = galinhas.filter(galinha => {
    // Filtro por nome
    if (filtrosAplicados.nome && !galinha.nome?.toLowerCase().includes(filtrosAplicados.nome.toLowerCase())) {
      return false
    }

    // Filtro por saúde
    if (filtrosAplicados.saude && galinha.saude !== filtrosAplicados.saude) {
      return false
    }

    // Filtro por raça
    if (filtrosAplicados.raca && !galinha.raca?.toLowerCase().includes(filtrosAplicados.raca.toLowerCase())) {
      return false
    }

    // Filtro por quarentena
    if (filtrosAplicados.quarentena) {
      const emQuarentena = filtrosAplicados.quarentena === 'sim'
      if (galinha.emQuarentena !== emQuarentena) {
        return false
      }
    }

    // Filtro por local
    if (filtrosAplicados.local && galinha.local !== filtrosAplicados.local) {
      return false
    }

    // Filtro por idade - só aplica se não for null
    const idade = calcularIdadeEmDias(galinha.data_nascimento)
    if (filtrosAplicados.idadeMin !== null && filtrosAplicados.idadeMax !== null && idade !== null) {
      if (idade < filtrosAplicados.idadeMin || idade > filtrosAplicados.idadeMax) {
        return false
      }
    }

    return true
  })

  const limparFiltros = () => {
    setFiltroNome('')
    setFiltroSaude('')
    setFiltroRaca('')
    setFiltroQuarentena('')
    setFiltroLocal('')
    setFiltroIdadeMin(0)
    setFiltroIdadeMax(365)
    // Aplica filtros limpos imediatamente - idade como null desativa
    setFiltrosAplicados({
      nome: '',
      saude: '',
      raca: '',
      quarentena: '',
      local: '',
      idadeMin: null,
      idadeMax: null,
    })
  }

  const aplicarFiltros = () => {
    setFiltrosAplicados({
      nome: filtroNome,
      saude: filtroSaude,
      raca: filtroRaca,
      quarentena: filtroQuarentena,
      local: filtroLocal,
      idadeMin: filtroIdadeMin,
      idadeMax: filtroIdadeMax,
    })
    setMostrarFiltros(false)
  }

  // Verificar se há filtros ativos
  const temFiltrosAtivos = 
    filtrosAplicados.nome !== '' ||
    filtrosAplicados.saude !== '' ||
    filtrosAplicados.raca !== '' ||
    filtrosAplicados.quarentena !== '' ||
    filtrosAplicados.local !== '' ||
    filtrosAplicados.idadeMin !== null ||
    filtrosAplicados.idadeMax !== null

  const deletarGalinha = (id) => {
    dispatch(removerGalinhaThunk(id))
  }

  if (galinhasStatus === 'loading' && galinhas.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  const renderItem = ({ item }) => {
    const localLabel = locais.find(l => l.value === item.local)?.label || '(não definido)'
    const idadeEmDias = calcularIdadeEmDias(item.data_nascimento)

    const handleEggPress = (ovo, galinhaId) => {
      // Navega para OvosForm com o ovo pré-preenchido
      // Origin é 'GalinhasListEdit' para indicar que veio da lista de galinhas
      navigation.navigate('OvosForm', { 
        ovo: ovo,
        origin: 'GalinhasListEdit'
      })
    }

    const handleAddEgg = () => {
      // Navega para OvosForm com galinha pré-preenchida para adicionar novo ovo
      navigation.navigate('OvosForm', {
        galinha: item, // Passa a galinha completa
        origin: 'GalinhasListAdd'
      })
    }

    // Verifica se há ovos hoje para esta galinha (com validação de data)
    const today = new Date()
    const todayString = today.toISOString().split('T')[0] // yyyy-mm-dd
    
    const eggsToday = ovos.filter(ovo => {
      if (ovo.galinhaId !== item.id) return false
      // Compara strings diretamente (yyyy-mm-dd)
      return ovo.data === todayString
    })

    const hasEggsToday = eggsToday.length > 0

    return (
      <Card style={layout.card}>
        <Card.Title 
          title={item.nome || 'Sem nome'}
          titleStyle={{ color: colors.textPrimary }}
        />
        <Card.Content style={{ gap: 4 }}>
          <Text style={typography.body}>Saúde: {item.saude || 'Não informada'}</Text>
          <Text style={typography.body}>Raça: {item.raca || 'Não informada'}</Text>
          <Text style={typography.body}>Quarentena: {item.emQuarentena ? 'Sim' : 'Não'}</Text>
          <Text style={typography.body}>Local: {localLabel}</Text>
          {item.local === 'galpao' && item.galpaoId && (
            <Text style={typography.body}>Galpão: {getNomeGalpao(item.galpaoId) || '(não encontrado)'}</Text>
          )}
          {item.local === 'galpao' && item.ninhoId && (
            <Text style={typography.body}>Ninho: {getNomeNinho(item.ninhoId) || '(não encontrado)'}</Text>
          )}
          {idadeEmDias !== null && (
            <Text style={typography.body}>
              Idade: {idadeEmDias} dias
            </Text>
          )}

          {/* Exibe ovos de hoje como ícones clicáveis + slots vazios */}
          <View style={styles.eggsSection}>
            {/* Mensagem quando não há ovos */}
            {!hasEggsToday && (
              <Text style={[typography.small, styles.noEggsText]}>
                Nenhum ovo hoje
              </Text>
            )}
            
            {/* Linha com ovos e slots vazios juntos */}
            <View style={styles.eggsRow}>
              {/* Ovos existentes */}
              {eggsToday.map(ovo => (
                <EggIcon
                  key={ovo.id}
                  tamanho={ovo.tamanho}
                  cor={ovo.cor}
                  qualidade={ovo.qualidade}
                  onPress={() => handleEggPress(ovo, item.id)}
                />
              ))}
              
              {/* Slots vazios (máximo 2 ovos por galinha por dia) */}
              {Array.from({ length: 2 - eggsToday.length }).map((_, index) => (
                <EmptyEggSlot
                  key={`empty-${index}`}
                  onPress={handleAddEgg}
                />
              ))}
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <ButtonPaper
            mode="outlined"
            textColor={colors.accent}
            style={{ borderColor: colors.accent }}
            onPress={() => navigation.navigate('GalinhasForm', { galinha: item })}
          >
            Editar
          </ButtonPaper>
          <ButtonPaper
            mode="contained"
            buttonColor={deleteColor}
            textColor={deleteTextColor}
            onPress={() => deletarGalinha(item.id)}
          >
            Deletar
          </ButtonPaper>
        </Card.Actions>
      </Card>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <View style={styles.header}>
        <Text style={[typography.title, styles.title]}>Galinhas</Text>
        {galinhasError && (
          <Text style={{ color: colors.error ?? '#d32f2f', marginBottom: 8 }}>
            {galinhasError}
          </Text>
        )}
        <View style={styles.filterContainer}>
          {temFiltrosAtivos && (
            <Text style={[typography.small, { color: colors.accent, marginRight: 8 }]}>
              Filtro ativo
            </Text>
          )}
          <IconButton
            icon={mostrarFiltros ? 'filter-off' : 'filter'}
            iconColor={colors.primary}
            size={24}
            onPress={() => setMostrarFiltros(!mostrarFiltros)}
          />
        </View>
      </View>

      {/* Contador de resultados */}
      <Text style={[typography.body, styles.contador, { color: colors.textSecondary }]}>
        Mostrando {galinhasFiltradas.length} de {galinhas.length} galinhas
      </Text>

      {/* Painel de Filtros */}
      {mostrarFiltros && (
        <View style={[layout.card, styles.filterPanel]}>
          <Text style={[typography.subtitle, { marginBottom: 12 }]}>Filtros</Text>

          {/* Filtro por nome */}
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.surface, 
              color: colors.textPrimary,
              borderColor: colors.border 
            }]}
            placeholder="Buscar por nome..."
            placeholderTextColor={colors.textSecondary}
            value={filtroNome}
            onChangeText={setFiltroNome}
          />

          {/* Filtro por saúde */}
          <CustomSelectField
            label="Estado de Saúde"
            value={filtroSaude}
            onValueChange={setFiltroSaude}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Boa', value: 'Boa' },
              { label: 'Fragilizada', value: 'Fragilizada' },
              { label: 'Adoecida', value: 'Adoecida' },
            ]}
            placeholder="Selecione o estado"
            zIndex={3000}
          />

          {/* Filtro por raça */}
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.surface, 
              color: colors.textPrimary,
              borderColor: colors.border 
            }]}
            placeholder="Buscar por raça..."
            placeholderTextColor={colors.textSecondary}
            value={filtroRaca}
            onChangeText={setFiltroRaca}
          />

          {/* Filtro por quarentena */}
          <CustomSelectField
            label="Quarentena"
            value={filtroQuarentena}
            onValueChange={setFiltroQuarentena}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Sim', value: 'sim' },
              { label: 'Não', value: 'nao' },
            ]}
            placeholder="Selecione"
            zIndex={2000}
          />

          {/* Filtro por local */}
          <CustomSelectField
            label="Tipo de Ambiente"
            value={filtroLocal}
            onValueChange={setFiltroLocal}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Galpão', value: 'galpao' },
              { label: 'Campo', value: 'campo' },
              { label: 'Quarentena', value: 'quarentena' },
            ]}
            placeholder="Selecione o ambiente"
            zIndex={1000}
          />

          {/* Filtro por idade */}
          <Text style={[typography.label, { marginTop: 8, marginBottom: 4 }]}>
            Idade (dias)
          </Text>
          <View style={styles.idadeRow}>
            <View style={{ flex: 1 }}>
              <NumberInput
                label="Mínimo"
                value={filtroIdadeMin}
                onChange={setFiltroIdadeMin}
                min={0}
                max={3650}
              />
            </View>
            <View style={{ flex: 1 }}>
              <NumberInput
                label="Máximo"
                value={filtroIdadeMax}
                onChange={setFiltroIdadeMax}
                min={0}
                max={3650}
              />
            </View>
          </View>

          {/* Botões de ação dos filtros */}
          <View style={styles.filterButtons}>
            <ButtonPaper
              mode="outlined"
              onPress={limparFiltros}
              style={{ flex: 1 }}
              textColor={colors.accent}
            >
              Limpar Filtros
            </ButtonPaper>
            <ButtonPaper
              mode="contained"
              onPress={aplicarFiltros}
              style={{ flex: 1 }}
            >
              Aplicar Filtros
            </ButtonPaper>
          </View>
        </View>
      )}

      <FlatList
        data={galinhasFiltradas}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
            {galinhas.length === 0 
              ? 'Nenhuma galinha cadastrada ainda 🐔'
              : 'Nenhuma galinha encontrada com esses filtros 🔍'
            }
          </Text>
        }
        renderItem={renderItem}
      />

      <ButtonPaper
        mode="contained"
        icon="plus"
        onPress={() => navigation.navigate('GalinhasForm')}
        style={[layout.button, styles.addButton]}
      >
        <Text>Adicionar Galinha</Text>
      </ButtonPaper>
    </View>
  )
}

const styles = StyleSheet.create({
  addButton: { marginTop: 16 },
  title: { marginBottom: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contador: {
    textAlign: 'center',
    marginBottom: 12,
  },
  filterPanel: {
    marginBottom: 12,
    padding: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  idadeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  eggsSection: {
    marginVertical: 8,
  },
  noEggsText: {
    color: '#8a8a8a',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  eggsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})
