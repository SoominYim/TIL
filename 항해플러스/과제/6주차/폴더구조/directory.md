```bash  
├─app
│  │  App.tsx
│  │  index.tsx
│  │  main.tsx
│  │  
│  ├─assets
│  │      react.svg
│  │      
│  ├─providers
│  │      QueryProvider.tsx
│  │      RouteProvider.tsx
│  │      
│  └─style
│          index.css
│          
├─entities
│  ├─comment
│  │  ├─api
│  │  │      createComments.ts
│  │  │      fetchComments.ts
│  │  │      
│  │  ├─model
│  │  │      types.ts
│  │  │      useComments.ts
│  │  │      
│  │  └─ui
│  │          CommentCard.ts
│  │          
│  ├─post
│  │  ├─api
│  │  │      createPost.ts
│  │  │      fetchPost.ts
│  │  │      
│  │  ├─model
│  │  │      type.ts
│  │  │      usePosts.ts
│  │  │      
│  │  └─ui
│  │          PostCard.tsx
│  │          
│  ├─posts
│  │  └─api
│  └─user
│      ├─api
│      │      fetchUser.ts
│      │      
│      ├─model
│      │      type.ts
│      │      useUser.ts
│      │      
│      └─ui
│              UserAvatar.tsx
│              
├─features
│  ├─comments
│  │  ├─api
│  │  │      deleteComment.ts
│  │  │      
│  │  ├─model
│  │  │      useCommentStore.ts
│  │  │      
│  │  └─ui
│  │          CommentForm.tsx
│  │          CommentsList.tsx
│  │          EditCommentDialog.tsx
│  │          
│  ├─filters
│  │  ├─api
│  │  │      useFilters.ts
│  │  │      
│  │  ├─model
│  │  │      fetchTags.ts
│  │  │      useFilterStore.ts
│  │  │      
│  │  └─ui
│  │          FilterControls.tsx
│  │          
│  ├─posts
│  │  ├─api
│  │  │      useDeletePost.ts
│  │  │      useUpdatePost.ts
│  │  │      
│  │  ├─model
│  │  │      queries.ts
│  │  │      usePostsStore.ts
│  │  │      utils.ts
│  │  │      
│  │  └─ui
│  │          AddPostDialog.tsx
│  │          EditPostDialog.tsx
│  │          PostsTable.tsx
│  │          
│  └─user
│      └─model
│              useUserStore.ts
│              
├─pages
│      PostsManagerPage.tsx
│      
├─shared
│  ├─config
│  │      constant.ts
│  │      
│  ├─hooks
│  ├─lib
│  │  ├─hooks
│  │  │      useURLParams.ts
│  │  │      
│  │  └─util
│  │          highlightText.tsx
│  │          
│  ├─model
│  │      useGlobalStore.ts
│  │      
│  └─ui
│      │  index.tsx
│      │  
│      ├─Button
│      │      index.tsx
│      │      
│      ├─Card
│      │      index.tsx
│      │      
│      ├─Dialog
│      │      index.tsx
│      │      
│      ├─Input
│      │      index.tsx
│      │      
│      ├─Select
│      │      index.tsx
│      │      
│      ├─Table
│      │      index.tsx
│      │      
│      └─Textarea
│              index.tsx
│              
└─widgets
    │  index.ts
    │  
    ├─Footer
    │      index.tsx
    │      
    ├─Header
    │      index.tsx
    │      
    ├─PostDetailDialog
    │      index.tsx
    │      PostDetailDialog.tsx
    │      
    └─userModal
            index.ts
            UserModal.tsx  
```  
