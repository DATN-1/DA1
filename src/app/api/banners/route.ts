import { 
    fetchAllBannersController, 
    createBannerController, 
    updateBannerController, 
    deleteBannerController 
} from '@/app/controllers/banner.Controllers';

export async function GET() {
    return fetchAllBannersController();
}

export async function POST(req: Request) {
    return createBannerController(req);
}

export async function PUT(req: Request) {
    return updateBannerController(req);
}

export async function DELETE(req: Request) {
    return deleteBannerController(req);
}
