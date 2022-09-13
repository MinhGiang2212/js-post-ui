import postApi from './api/postApi';

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    };
    const data = await postApi.getAll(queryParams);
    console.log('mainjs data', data);
  } catch (error) {
    console.log('get all failed', error);
  }

  await postApi.update({
    id: 'lea2aa9l7x3a5tg',
    title: 'Iure aperiam unde456',
  });
}
main();
