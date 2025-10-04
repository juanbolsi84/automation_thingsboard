export default class MockUtil {
    constructor(page) {
        this.page = page;
    }

    async mockDevicesPaginated() {
        // Prepare all 14 devices
        const allDevices = Array.from({ length: 14 }, (_, i) => ({
            id: i + 1,
            name: `Device ${i + 1}`,
            label: `Label ${i + 1}`,
            deviceProfileName: 'default',
            active: true,
        }));

        await this.page.route('**/api/tenant/deviceInfos**', async route => {
            // Extract page and pageSize from query params
            const url = new URL(route.request().url());
            const page = parseInt(url.searchParams.get('page')) || 0;
            const pageSize = parseInt(url.searchParams.get('pageSize')) || 10;

            const start = page * pageSize;
            const end = start + pageSize;
            const pagedDevices = allDevices.slice(start, end);

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: pagedDevices,
                    totalPages: Math.ceil(allDevices.length / pageSize),
                    totalElements: allDevices.length,
                    hasNext: end < allDevices.length,
                }),
            });
        });
    }
}
