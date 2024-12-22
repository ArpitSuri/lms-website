"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";


interface ConfirmModalProps{
    children : React.ReactNode;
    onConfirm:()=> void ;
}

export const ConfirmModal =({
    children,
    onConfirm
}:ConfirmModalProps)=>{
    return(
    <AlertDialog >
        <AlertDialogTrigger  asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you sure ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannont be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
)
}