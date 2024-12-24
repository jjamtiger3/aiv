interface Post {
    id: number;
    title: string;
    content: string;
}

interface PostPageProps {
    params: { id: string };
}
interface Menu {
    id: number;
    name: string;
}

export type { Post, PostPageProps, Menu };