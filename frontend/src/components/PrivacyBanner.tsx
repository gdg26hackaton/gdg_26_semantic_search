export const PrivacyBanner = ({ sessionId }) => (
  <div className="bg-blue-50 border-b border-blue-100 p-3 flex justify-between items-center text-sm">
    <div className="flex items-center gap-2 text-blue-700">
      <Lock size={16} />
      <span>Sus archivos están protegidos por una <strong>Llave de Sesión Temporal</strong>.</span>
    </div>
    <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono text-blue-800">
      ID: {sessionId.split('-')[0]}... (Privado)
    </code>
  </div>
);