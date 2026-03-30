import { 
    fetchAllSettingsController, 
    updateSettingsController 
} from '@/app/controllers/setting.Controllers';

export async function GET() {
    return fetchAllSettingsController();
}

export async function PUT(req: Request) {
    return updateSettingsController(req);
}
