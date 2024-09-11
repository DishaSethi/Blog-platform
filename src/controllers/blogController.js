const Blog=require('../models/blog');
const {BlogTagsEnum}=require('../utils/common/enums');
const Comment=require('../models/comment');
const getAllBlogs=async(req,res)=>{
    // console.log('getAllBlogs called');
    try{
        const filter=req.filter ||{};
        const options=req.options||{};
        const blogs=await Blog.find(filter)
             .sort(options.sort)
             .populate('author','username')
             .exec();
   
            //  console.log('Blogs found',blogs.length);
        res.status(200).json(blogs);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        });
    }
};

const getBlogById=async (req,res)=>{
    try{
        // const filter=req.filter ||{};
        // const options=req.options||{};
        const blog=await Blog.findById(req.params.id)
                    .populate('author','username')
                    .exec();
const comments=await Comment.find({blog:req.params.id}).populate('user','username');
        if(!blog){
            return res.status(404).json({
                message:'Blog not found'
            });
        }
        res.json({blog,comments});
    }catch(error){
        console.log(error);
        res.status(500).json({
        message:'Server error'
        });
    }
};

const createBlog=async(req,res)=>{

    console.log('Request Body:', req.body);
    const {title,content,tags}=req.body;
if(!title || !content){
    return res.status(400).json({message:'Title and content required'});
}

const tagsArray= (tags)?tags.split(',').map(tag=>tag.trim()):[];
// console.log('Parsed tags:',tagsArray);
if(!Array.isArray(tagsArray)||tagsArray.length>5){
    return res.status(400).json({
        message:'Tags must be an array with maximum of 5 tags'
    });
}

const allowedTags=Object.values(BlogTagsEnum);
// console.log('Allowed tags:',allowedTags);
    const invalidTags=tagsArray.filter(tag=> !Object.values(BlogTagsEnum).includes(tag));
    if(invalidTags.length>0){
        return res.status(400).json({
            message:`Invalid tags ${invalidTags.join(', ')}. Please use the valid tags ${allowedTags} `
        });
    }


if(!req.user){
    return res.status(401).json({
        message:'User is not authenticated'
    })
}

const blog=new Blog({
    title,
    content,
    author:req.user,
    tags:tagsArray || [],
});
    try{
        const newBlog=await blog.save();
        res.status(201).json(newBlog);
    } catch(error){
        res.status(400).json({
            message:error.message
        });
    }
};


const deleteBlog=async(req,res)=>{
    try{
        const blog=await Blog.findById(req.params.id);
        // if(!blog){
        //     return res.status(404).json({
        //         message:'Blog not found'
        //     });
        // }

        // if(blog.author.toString()!=req.user._id.toString()){
        //     return res.status
        // }
        if(blog.author.toString()!=req.user.toString()){
            return res.status(403).json({
                message:'Not authorized to delete this blog'
            })
        }
        await Blog.deleteOne({_id:req.params.id});
        res.json({
            message:'Blog deleted'
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            message:error.message
        });
    }
};

const updateBlog=async(req,res)=>{
    try{
        const blogId=req.params.id;
        const userId=req.user;
    const blog=await Blog.findById(blogId);

  if (blog.author.toString()!==userId.toString()){
    return res.status(403).json({
        message:'Not authorized to update the blog'
    });
  }
  console.log('Updates received:', req.body);

  const {title,content,tags}=req.body;
  const updates={};
  updates.title=title;
  updates.content=content;


  
const tagsArray=tags?tags.split(',').map(tag=>tag.trim()):[];

    if(tagsArray.length>5){
    return res.status(400).json({
        message:'Only maximum of 5 tags are allowed'
    });
  }
  
const allowedTags=Object.values(BlogTagsEnum);
  
  const invalidTags=tagsArray? tagsArray.filter(tag=>!Object.values(BlogTagsEnum).includes(tag)):[];
  if(invalidTags.length>0){
    return res.status(400).json({
        message:`Invalid tags: ${invalidTags.join(', ')}. Valid tags are ${allowedTags}`
    });
}
updates.tags=tagsArray;

  const updatedBlog=await Blog.findByIdAndUpdate(blogId,updates,{new:true});

  console.log('Updated blog:',updatedBlog);
  
  if(!updatedBlog){
    return res.json.status(404)({
        message:'Blog not updated'
    })
  };

  res.status(200).json({
    message:'Blog updated successfully',
    blog:updatedBlog
  });
}catch(error){

    console.log(error);
    res.status(500).json({
        message:'Server error'
    });
}
};

// const getBlogsByUser=async(req,res)=>{
//     try{
//         const userId=req.params.id;

//         if(!userId){
//             return res.status(400).json({
//                 message:'User ID is required'
//             });
//         }


//         const blogs=await Blog.find({author:userId});

//         if(blogs.length==0){
//             return res.status(404).json({
//                 message:'No blogs found for this user'
//             });
//         }
//         res.status(200).json(blogs);

//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({
//             message:'Server error'
//         });
//     }
// };

// const getBlogsByTag=async(req,res)=>{
//     try{
//         const tag=req.params.tag;

//         const formattedTag=tag.trim();
//         const allowedTags=Object.values(BlogTagsEnum);

//         if(!allowedTags.includes(formattedTag)){
//             return res.status(400).json({
//                 message:`Invalid tag: ${formattedTag}.Allowed tags are ${allowedTags}`,
//             });
//         }

//         const blogs=await Blog.find({tags:formattedTag});
//         if(blogs.length==0){
//             return res.status(404).json({
//                 message:`No blogs found with the tag ${formattedTag}`,
//             });
//         }

//         res.status(200).json(blogs);
//     }catch (error){
//         console.log(error);
//         res.status(500).json({
//             message:'Server error',
//         });
//     }
// };
module.exports={


    getAllBlogs,
    getBlogById,
    createBlog,
    deleteBlog,
    updateBlog,
    // getBlogsByUser,
    // getBlogsByTag
}