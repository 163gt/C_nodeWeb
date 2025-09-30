export const paginateData = (data: any[], pageNo: number, pageSize: number) => {
    const totalRecords = data.length; // 总记录数

    if (pageNo === -1 || pageSize === -1) {
        // 如果没有分页参数，则返回所有数据及相关信息
        return {
            page: 1,
            pageSize: totalRecords,
            data,
            total: totalRecords
        };
    }

    // 计算跳过的记录数
    const skip = (pageNo - 1) * pageSize;
    const paginatedData = data.slice(skip, skip + pageSize); // 裁剪数据
    
    return {
        page: pageNo, // 当前页
        pageSize, // 每页条数
        data: paginatedData, // 当前页的数据
        total: totalRecords // 总记录数
    };
};
