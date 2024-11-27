import scanOzon from './ozon.ts';
import scanWildberries from './wildberries.ts';

await Promise.all([/* scanOzon(),  */scanWildberries()]);
console.log('Сканирование завершено.');