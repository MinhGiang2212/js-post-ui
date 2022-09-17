import postApi from './api/postApi';
import { renderPagination, renderPostList, registerPagination, registerSearchInput } from './utils';
import debounce from 'debounce';

async function handlerFilterChange(filterName, filterValue) {
  try {
    //update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    //reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    window.history.pushState({}, '', url);

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('falied to fetch post list', error);
  }
}

//MAIN
(async () => {
  try {
    const url = new URL(window.location);

    //update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    window.history.pushState({}, '', url);
    const queryParams = url.searchParams;

    //add click event for links
    registerPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handlerFilterChange('_page', page),
    });
    registerSearchInput({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handlerFilterChange('title_like', value),
    });

    //render post list based URL params
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
    //show modal
  }
})();
