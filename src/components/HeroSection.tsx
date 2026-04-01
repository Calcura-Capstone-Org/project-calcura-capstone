/* Joseph St.John wrote all 38 lines of code for this file. */
import { Button } from "./ui/button";
import logoImage from "../assets/logoImage.png";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-gray-900 mb-6">
              Unlock Your Financial Health
            </h1>
            <p className="text-gray-600 text-xl mb-8">
              Calcura is the smart simple way to track, manage, and grow money
            </p>
            <div>
              <p className="text-gray-500 text-sm">
                Experience budgeting, what-if scenario planning, and personalized financial insights tailored to your life stage.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img
              src={logoImage}
              alt="Calcura Logo"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
