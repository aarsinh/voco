import mongoose, { connect } from 'mongoose';

const connectDB = async():Promise<void> => {
    const db = process.env.DB_LINK as string;
    try{
        await mongoose.connect(db);
        console.log('Mongodb connected...');
    } catch(err:any){
        console.log(err.message);
        process.exit(1);
    }
};
export default connectDB;