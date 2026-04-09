// 1.LLM call for structured data(object form) of pdf 
//2.if 1000 movie exist then LLM call = 1k 
//3.optimize it
// send it in batch of 50 , 50 ,...20 call goes
// mistake what LLM does here->what is any error occcur in any batches 
it did not retrive it 
// So now first upload this pdf into LLM and parellaly execute batch of 
//(50,50,50,50,50)(5 execute in parellel)
// is tarah 4 batches banegi and retry logic use if any error occcur
//now do indexing on each node 
//Now we have 1000 movies data now insert it into graphdb


//