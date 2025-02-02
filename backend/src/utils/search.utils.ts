
// backend/src/utils/search.utils.ts
export const createSearchQuery = (options: any) => {
    const {
      query,
      type,
      category,
      tags,
      status,
      author,
      dateRange
    } = options;
  
    const searchQuery: any = {};
  
    if (query) {
      searchQuery.$or = [
        { title: new RegExp(query, 'i') },
        { content: new RegExp(query, 'i') },
        { tags: new RegExp(query, 'i') }
      ];
    }
  
    if (type) searchQuery.type = type;
    if (category) searchQuery.category = category;
    if (status) searchQuery.status = status;
    if (author) searchQuery.author = author;
  
    if (tags) {
      if (Array.isArray(tags)) {
        searchQuery.tags = { $all: tags };
      } else {
        searchQuery.tags = tags;
      }
    }
  
    if (dateRange) {
      searchQuery.created_at = {
        $gte: new Date(dateRange.start),
        $lte: new Date(dateRange.end)
      };
    }
  
    return searchQuery;
  };
  