//hooks
import { motion } from 'framer-motion'

function ThreeDotsLoading(){

  const staggerVariantParent = {
    initial: {
      transition: {
        staggerChildren: 0.2
      }
    },
    animate: {
      transition: {
        staggerChildren: 0.2,
      }
    }
  }

  const staggerVariantChild = {
    initial: {
      y: "0%"
    },
    animate: {
      y: "50%"
    }
  }

  const loadingCircleTransition = {
    duration: 0.5,
    repeatType: "mirror" as ("reverse" | "loop" | "mirror" | undefined),
    repeat: Infinity,
    ease: "easeInOut",
  }

  return(
    <motion.div 
      className="flex items-center justify-center space-x-2 animate-pulse"
      variants={staggerVariantParent}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="w-2 h-2 bg-blue-400 rounded-full"
        variants={staggerVariantChild}
        transition={loadingCircleTransition}
      />
      <motion.div 
        className="w-2 h-2 bg-blue-400 rounded-full"
        variants={staggerVariantChild}
        transition={loadingCircleTransition}
      />
      <motion.div 
        className="w-2 h-2 bg-blue-400 rounded-full"
        variants={staggerVariantChild}
        transition={loadingCircleTransition}
      />
    </motion.div>
  )
}

export default ThreeDotsLoading