import { Card } from "./ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Calcura changed my relationship with money. I feel in control!",
    author: "Sarah K."
  },
  {
    id: 2,
    quote: "The AI insights helped me save $500 a month. Incredible!",
    author: "Michael T."
  },
  {
    id: 3,
    quote: "Best budgeting app I've ever used. Simple and powerful.",
    author: "Jessica M."
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-gray-900 mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-8 bg-white">
              <Quote className="w-12 h-12 text-blue-600 mb-4" />
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <p className="text-gray-900">- {testimonial.author}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
