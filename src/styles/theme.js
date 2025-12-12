// src/styles/theme.js

// Paleta base
// #9b7522ff 
// #e0a523ff 
// #8a5e00ff

export const colors = {
  primary: '#e28f13ff',        // Dourado-terra (principal)
  primaryOrange: '#e28f13',    // Laranja fixo para modo claro
  secondary: '#9B7522',        // Marrom médio
  accent: '#8A5E00',           // Marrom escuro (destaques)
  background: '#FFF3E0',       // Fundo laranja claro (consistente com verde/roxo)
  surface: '#FFFFFF',          // Branco (cards, inputs)
  textPrimary: '#2D2B26',      // Texto principal (escuro)
  textSecondary: '#6B6558',    // Texto secundário (médio)
  textLight: '#2D2B26',        // Texto em fundos claros (escuro)
  textOnPrimary: '#2D2B26',    // Texto em botões laranja (escuro)
  success: '#7CB342',          // Verde natural
  warning: '#FFA000',          // Amarelo alerta
  error: '#D32F2F',            // Vermelho erro
  info: '#0288D1',             // Azul informativo
  border: '#FFFFFF',           // Bordas brancas (para botões)
  white: '#FFFFFF',            // Branco puro
  black: '#000000',            // Preto
  tabBarInactive: '#8a8a8a',   // Cor da tab inativa
  // Cores de alertas para aviso info boxes
  alertBackground: '#FFF3CD',
  alertBorder: '#FFB700',
  alertText: '#856404',
}

export const typography = {
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  small: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  label: { 
    fontSize: 14,
    color: colors.textSecondary,
  },
}

export const layout = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  formContainer: {
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 6,
  },
  input: {
    backgroundColor: colors.surface, // fundo branco padronizado
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
}
