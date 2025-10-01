import { promise } from "zod";

export function withTimeout<T>(
    promiseFn: () => Promise<T>,
    ms: number,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`operation timed out after ${ms}ms`));
        }, ms);

        promiseFn()
            .then((result) => {
                clearTimeout(timeoutId);
                resolve(result);
            })
            .catch((err) => {
                clearTimeout(timeoutId);
                reject(err);
            });
    });
}