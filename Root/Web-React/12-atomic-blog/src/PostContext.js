import { faker } from "@faker-js/faker";
import { createContext, useContext, useState, useMemo } from "react";

const PostContext = createContext();


function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }

function PostProvider({children}){
    const [posts, setPosts] = useState(() =>
        Array.from({ length: 30 }, () => createRandomPost())
      );
      const [searchQuery, setSearchQuery] = useState("");
    
      // Derived state. These are the posts that will actually be displayed
      const searchedPosts =
        searchQuery.length > 0
          ? posts.filter((post) =>
              `${post.title} ${post.body}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
          : posts;
    
      function handleAddPost(post) {
        setPosts((posts) => [post, ...posts]);
      }
    
      function handleClearPosts() {
        setPosts([]);
      }


      const value = useMemo(()=>{
        return {
          posts: searchedPosts, 
          onAddPost: handleAddPost,
          onClearPosts: handleClearPosts,
          searchQuery,
          setSearchQuery,
        }
      }, [searchQuery, setSearchQuery]);

      
      return <PostContext.Provider value={value}>
        {children}
      </PostContext.Provider>
}

function usePosts(){
    const context = useContext(PostContext);
    if(!context){
        throw new Error('💣 undefined context in this block');
    }
    return context;
}

export {PostProvider, usePosts, createRandomPost};