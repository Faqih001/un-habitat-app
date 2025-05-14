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

// Slide down animation
export const slideDown = {
  hidden: { opacity: 0, y: -20 },
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
    y: -20,
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

// Staggered container for list items
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Stagger item - for use with staggerContainer
export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200
    }
  }
};

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

// Scale animation for buttons and interactive elements
export const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 }
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

// Glass card hover effect for modern UI
export const glassCardHover = {
  rest: { 
    y: 0, 
    opacity: 1,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  hover: { 
    y: -5, 
    opacity: 1,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
  }
};

// Pulse animation for notifications or highlighting elements
export const pulse = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "mirror"
    }
  }
};

// Rotate animation
export const rotate = {
  rest: { rotate: 0 },
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Bounce animation for playful UI elements
export const bounce = {
  rest: { y: 0 },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "mirror",
      repeatDelay: 0.25
    }
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3
    }
  }
};

// Child element reveal for page transitions
export const childrenReveal = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
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

// Modal animation variants
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

// Background blur animation
export const backgroundBlurVariants = {
  hidden: { backdropFilter: "blur(0px)" },
  visible: { 
    backdropFilter: "blur(8px)",
    transition: { duration: 0.3 }
  },
  exit: { 
    backdropFilter: "blur(0px)",
    transition: { duration: 0.2 } 
  }
};

// Skeleton loading animation
export const skeletonAnimation = {
  initial: { backgroundPosition: "-200% 0" },
  animate: { 
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1.5,
      ease: "linear"
    }
  }
};