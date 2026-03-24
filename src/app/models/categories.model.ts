// import pool from "../lib/db";

// export default async function getAllCategories() {
//     const [rows] = await pool.query('SELECT * FROM categories');
//     return rows;
// }

// export async function getCategoryById(id: string) {
//     const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
//     return rows[0];
// }

// export async function createCategory(categoryData: Partial<Category>) {
//     const [result] = await pool.query(
//         'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
//         [
//             categoryData.name,
//             categoryData.slug,
//             categoryData.description,
//             categoryData.image
//         ]
//     );
//     return result;
// }

// export async function updateCategory(id: string, categoryData: Partial<Category>) {
//     const [result] = await pool.query(
//         'UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?',
//         [
//             categoryData.name,
//             categoryData.slug,
//             categoryData.description,
//             categoryData.image,
//             id
//         ]
//     );
//     return result;
// }

// export async function deleteCategory(id: string) {
//     const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
//     return result;
// }