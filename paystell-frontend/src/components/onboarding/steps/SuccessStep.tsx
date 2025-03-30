"use client"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface SuccessStepProps {
  formData: {
    fullName: string
    businessName: string
    [key: string]: unknown
  }
}

export function SuccessStep({ formData }: SuccessStepProps) {
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

  return (
    <motion.div className="space-y-8 text-center" variants={containerVariants} initial="hidden" animate="show">
      <motion.div className="flex justify-center" variants={checkmarkVariants}>
        <div className="rounded-full bg-primary/10 p-3">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Setup Complete!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Congratulations, {formData.fullName}! Your PayStell merchant account for {formData.businessName} has been
          successfully created.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-medium">Next Steps</h3>
              <motion.ul className="space-y-3 text-left" variants={containerVariants} initial="hidden" animate="show">
                <motion.li className="flex items-start" variants={listItemVariants} custom={0}>
                  <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span>Verify your email address to activate your account</span>
                </motion.li>
                <motion.li className="flex items-start" variants={listItemVariants} custom={1}>
                  <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span>Complete your business verification (KYC) process</span>
                </motion.li>
                <motion.li className="flex items-start" variants={listItemVariants} custom={2}>
                  <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span>Set up your payment page and customize your checkout experience</span>
                </motion.li>
                <motion.li className="flex items-start" variants={listItemVariants} custom={3}>
                  <div className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span>Integrate PayStell with your website or application</span>
                </motion.li>
              </motion.ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div className="flex flex-col md:flex-row gap-4 justify-center pt-4" variants={itemVariants}>
        <Button size="lg" className="w-full md:w-auto group" onClick={() => (window.location.href = "/dashboard")}>
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
          >
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full md:w-auto group"
          onClick={() => window.open("https://docs.paystell.com", "_blank")}
        >
          View Documentation
          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

