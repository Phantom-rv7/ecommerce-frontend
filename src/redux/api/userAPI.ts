// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import axios from "axios";
// import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
// import { User } from "../../types/types";
// import { getAuth } from "firebase/auth";


// export const userAPI = createApi({
//   reducerPath:"userApi",
//   //   /api/v1/user/new
//   baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/user/`}),
//   tagTypes:["users"],
//   endpoints:(builder) => ({
//     login:builder.mutation<MessageResponse,User>({
//       query:(user) => ({
//       url:"new",
//       method:"POST",
//       body:user,
//       }),
//       invalidatesTags:["users"]
//     }),

//     deleleUser:builder.mutation<MessageResponse,DeleteUserRequest>({
//       query:({userId, adminUserId}) => ({
//       url:`${userId}?id${adminUserId}`,
//       method:"DELETE",
//       }),
//       invalidatesTags:["users"]
//     }),

//     allUsers:builder.query<AllUsersResponse, string>({
//       query: (id) => `all?id=${id}`,
//       providesTags:["users"],
//     }),


//   }),
// });

// //Route - /api/v1/user/dynamic id
// export const getUser = async (id:string) => {
//   try{
//     const {data}:{data: UserResponse} = await axios.get(
//       `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
//     );

//     return data;
    
//   } catch (error){
//     throw error;
//   }
// }



// export const {
//   useLoginMutation,
//   useAllUsersQuery,
//   useDeleleUserMutation,
// } = userAPI;



















import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";


export const userAPI = createApi({
  reducerPath:"userApi",
  //   /api/v1/user/new
  baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/user/`}),
  tagTypes:["users"],
  endpoints:(builder) => ({
    login:builder.mutation<MessageResponse,User>({
      query:(user) => ({
      url:"new",
      method:"POST",
      body:user,
      }),
      invalidatesTags:["users"]
    }),

    deleleUser:builder.mutation<MessageResponse,DeleteUserRequest>({
      query:({userId, adminUserId}) => ({
      url:`${userId}?id${adminUserId}`,
      method:"DELETE",
      }),
      invalidatesTags:["users"]
    }),

    allUsers:builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags:["users"],
    }),


  }),
});

//Route - /api/v1/user/dynamic id
export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}` // 
    );
    return data;
  } catch (error) {
    throw error;
  }
};



export const {
  useLoginMutation,
  useAllUsersQuery,
  useDeleleUserMutation,
} = userAPI;


