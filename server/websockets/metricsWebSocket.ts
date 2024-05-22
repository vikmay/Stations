// /server/websockets/metricsWebSocket.ts
import { WebSocketServer } from 'ws';
import { PostgresDataSource } from '../utils/database';
import { Metrics } from '../entities/Metrics';
import { Stations } from '../entities/Station';

export const setupWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws, req) => {
        const stationId = req.url ? req.url.split('/').pop() : null;

        if (stationId) {
            console.log(`Client connected for station ${stationId}`);

            // Send metrics to client at intervals
            const intervalId = setInterval(async () => {
                try {
                    const station = await PostgresDataSource.getRepository(
                        Stations
                    ).findOneBy({ id: parseInt(stationId) });

                    if (station && station.status) {
                        const metrics = await PostgresDataSource.getRepository(
                            Metrics
                        ).find({
                            where: { station: { id: parseInt(stationId) } },
                            order: { timestamp: 'DESC' },
                            take: 1,
                        });

                        if (metrics.length > 0) {
                            ws.send(JSON.stringify(metrics[0]));
                        } else {
                            ws.send(
                                JSON.stringify({ message: 'No metrics found' })
                            );
                        }
                    } else {
                        clearInterval(intervalId);
                        ws.close();
                    }
                } catch (error) {
                    console.error('Error fetching or sending metrics:', error);
                    clearInterval(intervalId);
                    ws.close();
                }
            }, 2000);

            ws.on('close', () => {
                console.log(`Client disconnected for station ${stationId}`);
                clearInterval(intervalId);
            });

            ws.on('error', (err) => {
                console.error('WebSocket error:', err);
                clearInterval(intervalId);
            });
        }
    });

    server.on('upgrade', (request: any, socket: any, head: any) => {
        const pathname = request.url?.split('/')[1];

        if (pathname === 'metrics') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });
};
