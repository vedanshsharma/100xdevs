
export default function adminAuth(req , res , next) {
    const role = req.role;
    // console.log(role);
    if(role !== 'admin'){
        return res.status(403).json({ 
            message: "Forbidden. Admin privileges required." 
        });
    }
    next();
}