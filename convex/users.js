import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutation to create a new user if they do not exist
export const CreateUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),
        picture:v.string(),
        uid:v.string()
    },

    handler:async(ctx , args) =>{
         // Check if a user with the given email already exists
        const user = await ctx.db.query('users').filter((q)=> q.eq(q.field('email'),args.email)).collect()
        
        // If no user exists, create a new one
        if(user?.length===0){
            const result= await ctx.db.insert('users',{
                name:args.name,
                picture:args.picture,
                email:args.email,
                uid:args.uid,
                token:5000
            });
            
        }
    }
})

// Query to get user details based on email
export const GetUser = query({
    args:{
        email:v.string()
    },
     handler:async(ctx,args) =>{
        const user = await ctx.db.query('users').filter((q)=> q.eq(q.field('email'),args.email)).collect()

        return user[0]
     }
})

// Mutation to update the token balance of a user
export const UpdateToken = mutation({
    args:{
        token:v.number(),
        userId:v.id('users'),
    },
    handler: async(ctx,args) =>{
        const result = await ctx.db.patch(args.userId,{
            token: args.token
        });
        return result;
    }
})