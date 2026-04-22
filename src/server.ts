import app from './app';
import { config } from './config';

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`🌟 Server is running on port ${PORT}`);
  console.log(`📦 Environment: ${config.env}`);
  console.log(`🔧 Mode: ${config.isDevelopment ? 'Development' : 'Production'}`);
});