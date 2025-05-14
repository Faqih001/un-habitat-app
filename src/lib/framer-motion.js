/**
 * Animation presets for Framer Motion
 * 
 * These presets can be used across the application to ensure consistent
 * animations and transitions throughout the UI.
 */

// Fade in animation (subtle)
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Fade in animation with delay (for staggered animations)
export const fadeInWithDelay = (delay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      delay
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
});

// Slide up animation
export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

// Slide up with delay (for staggered animations)
export const slideUpWithDelay = (delay = 0.1) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300,
      delay
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 }
  }
});

// Slide in from left animation
export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  }
};

// Slide in from right animation
export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 }
  }
};

// Scale up animation (for cards, modals, etc.)
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring', 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Staggered animation for lists (children stagger in)
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren
    }
  }
});

// Chart animations
export const chartAnimation = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: { 
    opacity: 1, 
    pathLength: 1,
    transition: { 
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// Bar chart animation
export const barChartAnimation = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Animation hooks
export const useAnimationHooks = {
  // Hover animation for cards
  cardHover: {
    whileHover: { scale: 1.02, y: -5 },
    whileTap: { scale: 0.98 }
  },
  
  // Hover animation for buttons (subtle)
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  },
  
  // Hover animation for links
  linkHover: {
    whileHover: { x: 3 }
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

// Utility function to create staggered animations for array items
export const createStaggeredAnimations = (items, animationPreset, staggerDelay = 0.05) => {
  return items.map((item, index) => ({
    ...item,
    animation: {
      ...animationPreset,
      visible: {
        ...animationPreset.visible,
        transition: {
          ...animationPreset.visible.transition,
          delay: index * staggerDelay
        }
      }
    }
  }));
}; 