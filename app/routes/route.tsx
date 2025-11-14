
const authRoutes = {
    login: 'auth/login',
    signup: 'auth/signup',
    loginWithPrivy: 'auth/login-privy', // New route for Privy OAuth login
    verifyOtp: 'auth/verify-otp',
    sendOtp: 'auth/login-phone',
    logout: 'auth/logout',
    getUser: 'auth/user',
    updateUser: 'auth/update-user',
    deleteUser: 'auth/delete-user',
    getUsers: 'auth/users',

    // Posts API endpoints
    getPosts: 'posts',
    getPost: 'posts', // Use with id: `posts/${id}`
    createPost: 'posts',
    updatePost: 'posts', // Use with id: `posts/${id}`
    deletePost: 'posts', // Use with id: `posts/${id}`
    getSavedPosts: 'posts/saved',
    getUserPosts: 'posts/user', // Use with userId: `posts/user/${userId}`
    likePost: 'posts', // Use with postId: `posts/${postId}/like`
    commentPost: 'posts', // Use with postId: `posts/${postId}/comment`
    getComments: 'posts', // Use with postId: `posts/${postId}/comments`
    repostPost: 'posts', // Use with postId: `posts/${postId}/repost`
    sharePost: 'posts', // Use with postId: `posts/${postId}/share`
    savePost: 'posts', // Use with postId: `posts/${postId}/save`
    likeComment: 'comments', // Use with postId: `posts/${postId}/like`
    postLikes: 'posts', // Use with postId: `posts/${postId}/likes`

    categories: 'categories',
    
    // Chat API endpoints
    getChats: 'chat',
    createChat: 'chat',
    searchUsers: 'chat/search-users',
    getMessages: 'chat', // Use with chatId: `chat/${chatId}/messages`
    editMessage: 'chat/messages', // Use with messageId: `chat/messages/${messageId}`
    deleteMessage: 'chat/messages', // Use with messageId: `chat/messages/${messageId}`
    deleteChat: 'chat', // Use with chatId: `chat/${chatId}`
    sendMessage: 'chat', // Use with chatId: `chat/${chatId}/messages`
    getFeedGreedIndex: 'market-data/fear-greed',
    getCoinPrice: 'market-data/coin-price',
    getMarketCap: 'market-data/coin-data',

    // ProfilePage 

    getProfile:'profile/get',
    profileUpdate:'profile/update',
    profileview :'profile/view',

    // NFT Collections
    createCollection: 'nft/collections',
    getCollections: 'nft/collections',
    
    // NFT Items
    createNFT: 'nft/items',
}

export default authRoutes;
