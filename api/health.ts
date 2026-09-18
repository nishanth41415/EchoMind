export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    service: 'EcoMind IoT API',
    timestamp: new Date().toISOString(),
  });
}
