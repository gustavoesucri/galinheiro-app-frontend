// src/styles/theme3.js - Tema Azul/Roxo

export const colors = {
  primary: '#5C6BC0',          // Roxo/Azul principal
  primaryOrange: '#e28f13',    // Laranja fixo para modo claro
  secondary: '#3F51B5',        // Roxo médio
  accent: '#1A237E',           // Roxo escuro
  background: '#E8EAF6',       // Fundo roxo claro
  surface: '#FFFFFF',          // Branco (cards, inputs)
  textPrimary: '#1A237E',      // Texto roxo escuro
  textSecondary: '#3F51B5',    // Texto roxo médio
  textLight: '#1A237E',        // Texto em fundos claros (escuro)
  textOnPrimary: '#FFFFFF',    // Texto em botões roxos (branco)
  success: '#7CB342',          // Verde natural
  warning: '#FFA000',          // Amarelo alerta
  error: '#D32F2F',            // Vermelho erro
  info: '#0288D1',             // Azul informativo
  border: '#FFFFFF',           // Bordas brancas
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
    backgroundColor: colors.surface,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
}
