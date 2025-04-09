export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const formData = req.body;
        const apiResponse = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
          method: 'POST',
          body: formData
        });
        const data = await apiResponse.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to scan QR code' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }