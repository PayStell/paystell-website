"use client"

import { Button } from "@/components/ui/button"
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface SuccessStepProps {
  formData: Record<string, any>
}

export function CompleteStep({ formData }: SuccessStepProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const checkmarkVariants = {
    hidden: { scale: 0 },
    show: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1,
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const handleSubmit = () => {
    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <CardHeader className="text-center p-0">
        <motion.div
          className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          variants={checkmarkVariants}
        >
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CardTitle className="text-2xl sm:text-3xl">Setup Complete!</CardTitle>
          <CardDescription className="text-base mt-2">
            You're all set to start accepting Stellar payments with PayStell
          </CardDescription>
        </motion.div>
      </CardHeader>

      <motion.div className="space-y-4" variants={itemVariants}>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Account Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <motion.div variants={listItemVariants}>
              <p className="text-muted-foreground">Business Name:</p>
              <p className="font-medium">{formData.businessName}</p>
            </motion.div>
            <motion.div variants={listItemVariants}>
              <p className="text-muted-foreground">Business Type:</p>
              <p className="font-medium">{formData.businessType}</p>
            </motion.div>
            <motion.div variants={listItemVariants}>
              <p className="text-muted-foreground">Stellar Address:</p>
              <p className="font-medium truncate">{formData.stellarAddress}</p>
            </motion.div>
            <motion.div variants={listItemVariants}>
              <p className="text-muted-foreground">Accepted Assets:</p>
              <p className="font-medium">{formData.acceptedAssets?.join(", ") || "XLM"}</p>
            </motion.div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Next Steps</h3>
          <motion.ul className="list-disc list-inside space-y-2 text-sm" variants={containerVariants}>
            <motion.li variants={listItemVariants}>Access your merchant dashboard to view transactions</motion.li>
            <motion.li variants={listItemVariants}>Create your first payment link to share with customers</motion.li>
            <motion.li variants={listItemVariants}>Set up your point-of-sale system if applicable</motion.li>
            <motion.li variants={listItemVariants}>Customize your payment page with your branding</motion.li>
          </motion.ul>
        </div>
      </motion.div>

      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-0 pt-4">
        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <Button variant="outline" asChild className="w-full">
            <Link href="/help">View Documentation</Link>
          </Button>
        </motion.div>
        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <Button onClick={handleSubmit} className="w-full group">
            Go to Dashboard
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                duration: 1,
                repeatDelay: 1,
              }}
            ></motion.span>
          </Button>
        </motion.div>
      </CardFooter>
    </motion.div>
  )
}

