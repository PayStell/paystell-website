"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import ProductTab from "./ProductTab";
import BrandingTab from "./BrandingTab";
import Preview from "./Preview";
import {
  type PaymentLinkFormValues,
  defaultValues,
  paymentLinkSchema,
} from "./schema/schema";
import useIsMobile from "@/hooks/mobile.hook";

export default function PaymentLinkBuilder() {
  const [activeTab, setActiveTab] = useState("product");
  const isMobile = useIsMobile();

  const form = useForm<PaymentLinkFormValues>({
    resolver: zodResolver(paymentLinkSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const formValues = watch();

  const resetToDefault = () => {
    reset(defaultValues);
  };

  const onSubmit = (data: PaymentLinkFormValues) => {
    console.log("Form submitted successfully:", data);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Payment Link Builder</h1>
        <Button variant="outline" size="sm" onClick={resetToDefault}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restablecer Valores
        </Button>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between px-6 pt-6">
                <TabsList>
                  <TabsTrigger value="product">Producto</TabsTrigger>
                  <TabsTrigger value="branding">Marca</TabsTrigger>
                </TabsList>
              </div>
              <Separator className="mt-6" />
              <CardContent className="pt-6">
                <TabsContent value="product">
                  <ProductTab
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                </TabsContent>
                <TabsContent value="branding">
                  <BrandingTab
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                </TabsContent>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSubmit(onSubmit)}>
                    Guardar Enlace de Pago
                  </Button>
                </div>
              </CardContent>
            </Tabs>
          </Card>

          <Card className="h-fit md:h-auto">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Vista Previa</h2>
              <div className="bg-muted/30 rounded-lg p-4 h-[600px] overflow-auto">
                <Preview data={formValues} isMobile={isMobile} />
              </div>
            </div>
          </Card>
        </div>
      </Form>
    </div>
  );
}
