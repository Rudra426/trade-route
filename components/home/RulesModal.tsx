"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function RulesModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-8 text-xl rounded-xl">
            Read the Scrolls
          </Button>
        } 
      />
      
      <DialogContent>
        <div className="p-2 sm:p-4">
          <DialogHeader className="mb-6 border-b-2 border-leather/30 pb-4">
            <DialogTitle className="text-4xl text-center">
              The Merchant&apos;s Codex
            </DialogTitle>
            <DialogDescription className="text-center text-leather/80 font-medium text-lg italic font-serif">
              A Guide to Wealth and Prosperity in Ancient India
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-leather leading-relaxed">
            <section className="bg-sandstone-light/50 p-6 rounded-lg border border-leather/20 shadow-inner">
              <h3 className="text-2xl font-serif font-bold text-terracotta mb-3">I. The Goal</h3>
              <p>
                Your objective is to become the wealthiest merchant of antiquity. Buy cities, charge tolls to those who travel through them, and force your rivals into bankruptcy. The last merchant standing is the victor.
              </p>
            </section>

            <section className="bg-sandstone-light/50 p-6 rounded-lg border border-leather/20 shadow-inner">
              <h3 className="text-2xl font-serif font-bold text-terracotta mb-3">II. The Journey</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Roll the Bones:</strong> Roll the dice to move your caravan. Doubles grant another turn!</li>
                <li><strong>Acquire Territory:</strong> Unowned cities may be purchased for their Title Deed.</li>
                <li><strong>Pay Tolls:</strong> Landing on a rival&apos;s city requires paying a toll based on developments.</li>
              </ul>
            </section>

            <section className="bg-sandstone-light/50 p-6 rounded-lg border border-leather/20 shadow-inner">
              <h3 className="text-2xl font-serif font-bold text-terracotta mb-3">III. Events & Hazards</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Caravan Events:</strong> Draw a scroll bringing unexpected fortune or disaster.</li>
                <li><strong>Detention:</strong> Rolling doubles thrice or drawing a specific scroll lands you in Detention. Pay ₹50 or roll doubles to escape!</li>
              </ul>
            </section>

            <section className="bg-sandstone-light/50 p-6 rounded-lg border border-leather/20 shadow-inner">
              <h3 className="text-2xl font-serif font-bold text-terracotta mb-3">IV. Diplomacy & Trade</h3>
              <p>
                At the end of your turn, dispatch an emissary to negotiate. Trade gold and properties freely to secure monopolies.
              </p>
            </section>

             <section className="bg-sandstone-light/50 p-6 rounded-lg border border-leather/20 shadow-inner">
              <h3 className="text-2xl font-serif font-bold text-terracotta mb-3">V. Development</h3>
              <p>
                Owning all cities of a region allows you to build <strong>Trading Posts</strong> and a <strong>Grand Bazaar</strong> to increase tolls.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-4 border-t-2 border-leather/30 text-center">
            <Button 
              onClick={() => setOpen(false)}
              className="px-12 py-6 text-lg w-full sm:w-auto"
            >
              I Am Ready
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
