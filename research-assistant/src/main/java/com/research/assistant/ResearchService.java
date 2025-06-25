package com.research.assistant;

import org.springframework.stereotype.Service;

@Service
public class ResearchService {

   public String processContent(ResearchRequest request){
       //build the prompt
       //query the AI model API
       //parse the response
       //return response
   }

   private String buildPrompt(ResearchRequest request){
       StringBuilder prompt=new StringBuilder();
       switch (request.getOperation()){
           case "summarize" :
               prompt.append("Provide a clear and concise summary of the following text in a few sentences:\n\n");
               break;

           case "suggest" :
               prompt.append("Based on the following content: suggest related topics and further reading. Format the response with clear headings and bullet points:\n\n");
               break;

           default:
               throw new IllegalArgumentException("unknown operation: "+ request.getOperation());
       }
   }
}
