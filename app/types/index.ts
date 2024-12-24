interface Post {
    id: number;
    title: string;
    content: string;
}

interface PostPageProps {
    params: { id: string };
}

export type { Post, PostPageProps };