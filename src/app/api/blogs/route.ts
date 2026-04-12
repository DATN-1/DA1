import { 
    fetchAllBlogsController, 
    createBlogController, 
    updateBlogController, 
    deleteBlogController 
} from '@/app/controllers/blog.Controllers';

export async function GET() {
    return fetchAllBlogsController();
}

export async function POST(req: Request) {
    return createBlogController(req);
}

export async function PUT(req: Request) {
    return updateBlogController(req);
}

export async function DELETE(req: Request) {
    return deleteBlogController(req);
}
