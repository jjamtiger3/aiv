const base = 'http://localhost:4000';
const get = async (url, obj) => {
    const res = await fetch(`${base}${url}`, obj).then(res => res.json());
    return res;
}

export {
    get
}
