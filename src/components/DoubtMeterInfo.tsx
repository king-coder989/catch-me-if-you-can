
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

const DoubtMeterInfo = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Doubt Meter Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-purple-400">About the Doubt Meter</DialogTitle>
          <DialogDescription className="text-gray-300">
            Understanding how doubt affects your gameplay
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>
            The Doubt Meter represents how much you trust or distrust the AI grandmother's hints.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-300">High Trust (Low Doubt):</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>The AI will try to exploit your trust with more deceptive hints</li>
              <li>You may receive better rewards when successful</li>
              <li>Risk of manipulation increases</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-300">High Doubt (Low Trust):</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>The AI might provide more straightforward hints</li>
              <li>May receive fewer or less powerful rewards</li>
              <li>More cautious, potentially safer gameplay</li>
            </ul>
          </div>
          
          <p>
            Your doubt level changes based on your door choices, whether you follow or ignore hints,
            and how you use special abilities like "Peek" and "Beg for Mercy."
          </p>
        </div>
        
        <DialogClose asChild>
          <Button className="mt-2">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DoubtMeterInfo;
