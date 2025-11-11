const authRoutes = {
    login: 'auth/login',
    signup: 'auth/signup',
    verifyOtp: 'auth/verify-otp',
    sendOtp: 'auth/login-phone',
    googleLogin: 'auth/google-login', // Privy/Google login endpoint
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
    
}

export default authRoutes;