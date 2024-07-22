import { db } from "../../lib/db"; // Ensure the path is correct
import { SqliteError } from "better-sqlite3";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
    // Obtiene los datos del formulario
    const formData = await context.request.formData();
    const userId = formData.get("user_id");
    const score = parseInt(formData.get("score") as string, 10);

    // Validación de datos
    if (typeof userId !== "string" || isNaN(score)) {
        return new Response(
            JSON.stringify({ error: "Invalid input" }),
            { status: 400 }
        );
    }

    try {
        // Ejecuta la consulta SQL con .run()
        const stmt = db.prepare(`
            INSERT INTO score (user_id, score) 
            VALUES (?, ?) 
            ON CONFLICT(user_id) 
            DO UPDATE SET score = score + excluded.score
        `);
        stmt.run(userId, score);

        return new Response(
            JSON.stringify({ message: "Score updated successfully" }),
            { status: 200 }
        );
    } catch (e) {
        if (e instanceof SqliteError) {
            return new Response(
                JSON.stringify({ error: "Database error" }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ error: "Unknown error occurred" }),
            { status: 500 }
        );
    }
}

// Generador de ID (puedes usar cualquier otro método)
const generateId = () => {
    return require('crypto').randomBytes(16).toString('hex');
};
