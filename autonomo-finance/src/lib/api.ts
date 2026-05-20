const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
import { User } from "@/types/index";

export async function createToken(data: User) {
    const res = await fetch(`${apiURL}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Erro ao criar usuário')

    return res.json();
}