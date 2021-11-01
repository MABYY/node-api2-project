// implement your posts router here
const { restart } = require('nodemon');
const router = require('express').Router();
const Posts = require('./posts-model');


router.get('/', async (req, res) =>{

    try{
        const posts = await Posts.find()
        res.status(200).json(posts);
    } catch(error) {
        res.status(500).json({
            message: "The posts information could not be retrieved",
        });
    }
});

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params
        const post = await Posts.findById(id)

        if (post)  {
            res.status(200).json(post)
        } else {
            res.status(404).json({
                message:"The post with the specified ID does not exist",
            })
        }

    } catch (error) {
            res.status(500).json({
            message:"The post information could not be retrieved",
        })
        
    }
})


router.post('/', async (req, res) =>{
    try{ 

        const { title , contents } = req.body

        if(!title || !contents) {
            res.status(400).json({
                message:"Please provide title and contents for the post",
            })

        } else {
            const makePost = await Posts.insert({ title , contents });
            const showNewPost = await Posts.findById(makePost.id)
            res.status(201).json(showNewPost)
        }  
    } catch(error) {

        res.status(500).json({
            message: "There was an error while saving the post to the database",
        });
    }
});


router.put('/:id', async (req,res) => {
    try {
        const { title , contents } = req.body 
        if(!title || !contents) {
            res.status(400).json({
                message:"Please provide title and contents for the post",
            }) 
        } else {
            const { id } = req.params
            const post = await Posts.findById(id)

            if(!post){
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                await Posts.update(req.params.id, req.body )
                res.status(200).json(post)
            }

        }

    } catch (error) {
            res.status(500).json({
            message:"The post information could not be modified",
        })
        
    }
})

router.delete('/:id', async (req,res) => {
    try {
        // const { id } = req.params.id 
         const remPost = await Posts.findById(req.params.id )
         if (!remPost) {
             res.status(404).json({
                 message:"The post with the specified ID does not exist",
             })
         } else {
             await Posts.remove(req.params.id)
             res.status(200).json(remPost)
         }

    } catch (error) {
            res.status(500).json({
            message:"The post could not be removed",
        })
        
    }
})

router.get('/:id/comments', async (req,res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post){
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            const comments = await Posts.findPostComments(req.params.id)
            res.status(200).json(comments)
        }

    } catch (error) {
            res.status(500).json({
            message:"The comments information could not be retrieved",
        })
        
    }
})

module.exports = router
